// src/lib/ai/asi-one.ts
import { z } from "zod";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import { withRetry } from "./retry";
import { computeCostUsd } from "./cost";

const ASI_ONE_CHAT_URL = `${env.ASI_ONE_BASE_URL}/chat/completions`;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AsioneOptions {
  temperature?: number;       // default 0.2
  maxTokens?: number;         // default 2048
  jsonMode?: boolean;         // default true
  operationId: string;        // idempotency / audit
  signal?: AbortSignal;
  /**
   * Enable ASI:One live web search capability.
   * When true, the model can browse the internet before generating a response.
   * Useful for extracting up-to-date deadlines, policies, or external data.
   * @see https://docs.asi1.ai/documentation/build-with-asi-one/openai-compatibility
   */
  webSearch?: boolean;
  /**
   * ASI:One session ID for persistent agentic memory.
   * Pass the same ID across multiple calls to preserve conversation context
   * on ASI:One's infrastructure between requests.
   * @see https://docs.asi1.ai/documentation/build-with-asi-one/openai-compatibility
   */
  sessionId?: string;
}

export interface AsioneResult<T> {
  data: T;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  costUsd: number;
  model: string;
  raw: string;
}

/**
 * Typed ASI:ONE chat call with structured output enforcement.
 * Always retries with self-correction on schema failure.
 * Supports optional live web search and persistent agentic session memory.
 */
export async function callAsione<T>(
  messages: ChatMessage[],
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  options: AsioneOptions
): Promise<AsioneResult<T>> {
  const temperature = options.temperature ?? 0.2;
  const maxTokens = options.maxTokens ?? 2048;
  const model = env.ASI_ONE_MODEL;

  const startedAt = Date.now();

  const callOnce = async (overrideMessages?: ChatMessage[]): Promise<AsioneResult<T>> => {
    const msgs = overrideMessages ?? messages;

    const body: Record<string, unknown> = {
      model,
      messages: msgs,
      temperature,
      max_tokens: maxTokens,
      response_format: options.jsonMode === false ? undefined : { type: "json_object" },
    };

    // ASI:One-specific: enable live web search if requested
    if (options.webSearch) {
      body.web_search = true;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.ASI_ONE_API_KEY}`,
      "X-Operation-Id": options.operationId,
    };

    // ASI:One-specific: inject session ID for persistent agentic memory
    if (options.sessionId) {
      headers["x-session-id"] = options.sessionId;
    }

    const res = await fetch(ASI_ONE_CHAT_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: options.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`ASI:ONE ${res.status}: ${text.slice(0, 500)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    const tokensIn: number = json?.usage?.prompt_tokens ?? 0;
    const tokensOut: number = json?.usage?.completion_tokens ?? 0;
    const latencyMs = Date.now() - startedAt;

    let parsed: unknown;
    try {
      const cleanContent = content.replace(/^```json\n?|\n?```$/g, '').trim();
      parsed = JSON.parse(cleanContent);
    } catch {
      throw new Error(`ASI:ONE returned non-JSON: ${content.slice(0, 200)}`);
    }

    const result = schema.safeParse(parsed);
    if (!result.success) {
      const issue = result.error.issues.slice(0, 3).map((i) =>
        `${i.path.join(".")}: ${i.message}`).join("; ");
      throw new SchemaMismatchError(`Schema validation failed: ${issue}`, content);
    }

    return {
      data: result.data,
      tokensIn, tokensOut, latencyMs,
      costUsd: computeCostUsd(model, tokensIn, tokensOut),
      model, raw: content,
    };
  };

  try {
    const result = await withRetry(async (attempt) => {
      try {
        return await callOnce();
      } catch (err) {
        if (err instanceof SchemaMismatchError && attempt < 2) {
          // Self-correction: feed the error back to the model
          logger.warn({ operationId: options.operationId, err: err.message }, "ASI:ONE schema mismatch, retrying with correction");
          return await callOnce([
            ...messages,
            { role: "assistant", content: err.raw },
            {
              role: "user",
              content:
                `Your previous response failed schema validation with: ${err.message}\n` +
                `Return ONLY a corrected JSON object that strictly matches the schema. ` +
                `Do not include any explanation or markdown.`,
            },
          ]);
        }
        throw err;
      }
    }, { retries: 3, baseMs: 500, maxMs: 5_000 });

    return result;
  } catch (err) {
    logger.error({ err, operationId: options.operationId }, "ASI:ONE call failed permanently");
    throw err;
  }
}

class SchemaMismatchError extends Error {
  constructor(message: string, public raw: string) {
    super(message);
    this.name = "SchemaMismatchError";
  }
}