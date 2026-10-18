/**
 * Live AtomicAssets API — schemas & templates.
 * Same public indexer AtomicHub uses under the hood.
 */

import type { AtomicSchema, AtomicTemplate, SchemaAttribute } from "../types";

export const DEFAULT_ATOMIC = "https://wax.api.atomicassets.io";

interface RawSchema {
  schema_name?: string;
  collection_name?: string;
  format?: { name?: string; type?: string }[];
}

interface RawTemplate {
  template_id?: string | number;
  collection?: { collection_name?: string };
  schema?: { schema_name?: string };
  max_supply?: string | number;
  is_transferable?: boolean;
  is_burnable?: boolean;
  immutable_data?: Record<string, unknown>;
  mutable_data?: Record<string, unknown>;
}

export function mapSchema(raw: RawSchema): AtomicSchema | null {
  const schemaName = raw.schema_name;
  const collectionName = raw.collection_name;
  if (!schemaName || !collectionName) return null;
  const format: SchemaAttribute[] = (raw.format ?? []).map((f) => ({
    name: f.name || "unknown",
    format: f.type || "string",
  }));
  return { collectionName, schemaName, format };
}

export function mapTemplate(raw: RawTemplate): AtomicTemplate | null {
  const templateId = raw.template_id;
  const collectionName = raw.collection?.collection_name;
  const schemaName = raw.schema?.schema_name;
  if (templateId == null || !collectionName || !schemaName) return null;
  return {
    templateId,
    collectionName,
    schemaName,
    maxSupply: raw.max_supply ?? 0,
    isTransferable: raw.is_transferable,
    isBurnable: raw.is_burnable,
    immutableData: raw.immutable_data ?? {},
    mutableData: raw.mutable_data,
  };
}

export async function fetchCollectionSchemas(
  collection: string,
  options: { atomicBase?: string; limit?: number; signal?: AbortSignal } = {}
): Promise<{ schemas: AtomicSchema[]; source: string }> {
  const base = (options.atomicBase || DEFAULT_ATOMIC).replace(/\/$/, "");
  const name = collection.trim().toLowerCase();
  if (!name) throw new Error("Collection required");
  const limit = options.limit ?? 50;
  const url = `${base}/atomicassets/v1/schemas?collection_name=${encodeURIComponent(
    name
  )}&limit=${limit}`;
  const res = await fetch(url, {
    signal: options.signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`AtomicAssets ${res.status}: ${res.statusText}`);
  const json = await res.json();
  const rows: RawSchema[] = json.data ?? [];
  const schemas: AtomicSchema[] = [];
  for (const row of rows) {
    const s = mapSchema(row);
    if (s) schemas.push(s);
  }
  return { schemas, source: url };
}

export async function fetchCollectionTemplates(
  collection: string,
  options: { atomicBase?: string; limit?: number; signal?: AbortSignal } = {}
): Promise<{ templates: AtomicTemplate[]; source: string }> {
  const base = (options.atomicBase || DEFAULT_ATOMIC).replace(/\/$/, "");
  const name = collection.trim().toLowerCase();
  if (!name) throw new Error("Collection required");
  const limit = options.limit ?? 40;
  const url = `${base}/atomicassets/v1/templates?collection_name=${encodeURIComponent(
    name
  )}&limit=${limit}&order=desc&sort=created`;
  const res = await fetch(url, {
    signal: options.signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`AtomicAssets ${res.status}: ${res.statusText}`);
  const json = await res.json();
  const rows: RawTemplate[] = json.data ?? [];
  const templates: AtomicTemplate[] = [];
  for (const row of rows) {
    const t = mapTemplate(row);
    if (t) templates.push(t);
  }
  return { templates, source: url };
}
