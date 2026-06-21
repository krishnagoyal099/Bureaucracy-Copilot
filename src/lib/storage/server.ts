// src/lib/storage/server.ts
export async function fetchUploadThingFile(key: string): Promise<Buffer> {
  const url = `https://utfs.io/f/${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch UploadThing file: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
