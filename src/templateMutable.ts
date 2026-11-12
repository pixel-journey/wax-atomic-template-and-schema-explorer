/**
 * settempldata and check_name_length from atomicassets-contract tag v2.0.0
 * src/atomicassets.cpp. Not compiled. Collection auth is not checked.
 * Attribute serialization is previewAttributeValues, not this function.
 * The contract also queues logsetdatatl. This preview does not.
 */

export type MutableEffect = "unchanged" | "emplace" | "modify" | "erase";

export type MutableResult =
  | { ok: false; reason: string }
  | { ok: true; action: "settempldata"; effect: MutableEffect };

export function previewDisplayName(name: string | null): { ok: true } | { ok: false; reason: string } {
  if (name !== null && name.length > 64) {
    return { ok: false, reason: 'Names (attribute with name: "name") can only be 64 characters max' };
  }
  return { ok: true };
}

export function previewSetTemplateData(input: {
  templateExists: boolean;
  schemaExists: boolean;
  hasMutableRow: boolean;
  valueCount: number;
  displayName: string | null;
}): MutableResult {
  if (!input.templateExists) {
    return { ok: false, reason: "No template with the specified id exists for the specified collection" };
  }
  if (!input.schemaExists) return { ok: false, reason: "No schema with this name exists" };
  const named = previewDisplayName(input.displayName);
  if (!named.ok) return named;
  if (!input.hasMutableRow && input.valueCount === 0) return { ok: true, action: "settempldata", effect: "unchanged" };
  if (!input.hasMutableRow) return { ok: true, action: "settempldata", effect: "emplace" };
  if (input.valueCount === 0) return { ok: true, action: "settempldata", effect: "erase" };
  return { ok: true, action: "settempldata", effect: "modify" };
}
