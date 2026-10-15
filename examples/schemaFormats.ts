/**
 * Common AtomicAssets schema format strings and pure validators.
 * Keep this list conservative; prefer documented formats over invention.
 */

import type {
  AtomicSchema,
  FieldValidationResult,
  SchemaValidationResult,
} from "./types";

/** Frequently used format identifiers (not exhaustive of every IPFS/variant) */
export const KNOWN_FORMATS = [
  "string",
  "ipfs",
  "bool",
  "int8",
  "uint8",
  "int16",
  "uint16",
  "int32",
  "uint32",
  "int64",
  "uint64",
  "float",
  "double",
  "image",
] as const;

export type KnownFormat = (typeof KNOWN_FORMATS)[number];

export function isKnownFormat(format: string): boolean {
  return (KNOWN_FORMATS as readonly string[]).includes(format);
}

export function describeFormat(format: string): string {
  switch (format) {
    case "string":
      return "UTF-8 text";
    case "ipfs":
      return "IPFS hash / path reference";
    case "bool":
      return "Boolean true/false";
    case "image":
      return "Image reference (often URL or IPFS)";
    case "float":
    case "double":
      return "Floating-point number";
    default:
      if (format.startsWith("int") || format.startsWith("uint")) {
        return `Integer type (${format})`;
      }
      return isKnownFormat(format)
        ? format
        : "Unknown or custom format — verify against Atomic docs";
  }
}

function isIntegerString(value: unknown): boolean {
  if (typeof value === "number") return Number.isInteger(value);
  if (typeof value === "string" && /^-?\d+$/.test(value)) return true;
  return false;
}

/**
 * Lightweight client-side check of a single attribute value against a format.
 * Not a full chain-parity validator — educational and pre-flight only.
 */
export function validateAttributeValue(
  format: string,
  value: unknown
): FieldValidationResult["message"] | undefined {
  if (value === undefined || value === null) {
    return "Value is missing";
  }

  switch (format) {
    case "string":
    case "ipfs":
    case "image":
      if (typeof value !== "string") return "Expected a string";
      if (value.length === 0) return "String is empty";
      return undefined;
    case "bool":
      if (typeof value !== "boolean") return "Expected a boolean";
      return undefined;
    case "float":
    case "double":
      if (typeof value !== "number" || Number.isNaN(value)) {
        return "Expected a number";
      }
      return undefined;
    default:
      if (format.startsWith("int") || format.startsWith("uint")) {
        if (!isIntegerString(value)) return `Expected integer for ${format}`;
        return undefined;
      }
      if (!isKnownFormat(format)) {
        return `Unrecognized format "${format}" — validate manually`;
      }
      return undefined;
  }
}

export function validateAgainstSchema(
  schema: AtomicSchema,
  data: Record<string, unknown>
): SchemaValidationResult {
  const fields: FieldValidationResult[] = schema.format.map((attr) => {
    const message = validateAttributeValue(attr.format, data[attr.name]);
    return {
      field: attr.name,
      ok: !message,
      message,
    };
  });

  // Flag extra keys not in schema (informational)
  for (const key of Object.keys(data)) {
    if (!schema.format.some((a) => a.name === key)) {
      fields.push({
        field: key,
        ok: false,
        message: "Not declared in schema format list",
      });
    }
  }

  return {
    ok: fields.every((f) => f.ok),
    fields,
  };
}
