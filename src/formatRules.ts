/**
 * check_format from atomicassets-contract tag v2.0.0 include/checkformat.hpp.
 * Not compiled. The header comment lists "byte". The code accepts "bytes".
 *
 * A schema line is { name, type }. Types are the scalar list, plus one "[]".
 * Nested vectors fail. Names must be unique and at most 64 characters.
 * Every schema needs a line whose name is "name" and whose type is "string".
 */

export type FormatLine = { name: string; type: string };

export type FormatResult =
  | { ok: false; reason: string }
  | { ok: true; action: "check_format"; lines: number };

const SCALARS = new Set(["float", "double", "string", "image", "ipfs", "bool", "bytes"]);

function typeOk(type: string): boolean {
  let rest = type;
  if (rest.endsWith("[]")) {
    rest = rest.slice(0, -2);
    if (rest.includes("[]")) return false;
  }
  if (SCALARS.has(rest)) return true;
  return /^(?:int|uint|fixed)(?:8|16|32|64)$/.test(rest);
}

export function previewSchemaFormat(lines: readonly FormatLine[]): FormatResult {
  const seen = new Set<string>();
  let foundName = false;
  for (const line of lines) {
    if (line.name.length === 0) return { ok: false, reason: "An attribute's name can't be empty" };
    if (line.name.length > 64) return { ok: false, reason: "An attribute's name can only be 64 characters max" };
    if (line.name === "name" && line.type === "string") foundName = true;
    if (!typeOk(line.type)) {
      return { ok: false, reason: `'type' attribute has an invalid format - ${line.type}` };
    }
    if (seen.has(line.name)) {
      return { ok: false, reason: `there already is an attribute with the same name - ${line.name}` };
    }
    seen.add(line.name);
  }
  if (!foundName) {
    return {
      ok: false,
      reason: 'A format line with {"name": "name" and "type": "string"} needs to be defined for every schema',
    };
  }
  return { ok: true, action: "check_format", lines: lines.length };
}
