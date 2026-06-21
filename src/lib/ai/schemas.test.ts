import { describe, it, expect } from 'vitest';
import { OpportunityRequirementsSchema, EligibilityResultSchema } from './schemas';

describe('AI Output Schemas (Zod Fallbacks)', () => {
  it('should fail validation when ASI:ONE returns malformed JSON instead of silently passing', () => {
    const malformedAiOutput = {
      title: 123, // wrong type
      eligibilityRequirements: null, // wrong type
      requiredDocuments: "not an array" // wrong type
    };

    const parsed = OpportunityRequirementsSchema.safeParse(malformedAiOutput);
    expect(parsed.success).toBe(false);
  });

  it('should strictly validate a correct Eligibility Result', () => {
    const validOutput = {
      status: 'ELIGIBLE',
      confidence: 0.95,
      matchedCriteria: ['Age'],
      unmatchedCriteria: [],
      missingInformation: [],
      reasons: [{ criterion: 'Age', verdict: 'PASS', explanation: 'User is 20' }],
      warnings: [],
      recommendations: []
    };

    const parsed = EligibilityResultSchema.safeParse(validOutput);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe('ELIGIBLE');
      expect(parsed.data.confidence).toBe(0.95);
    }
  });
});
