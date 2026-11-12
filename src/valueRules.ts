/**
 * Value checks from atomicassets-contract tag v2.0.0 include/atomicdata.hpp
 * serialize / serialize_attribute. Not compiled. Does not emit bytes.
 *
 * A format line with no value is skipped. A value whose name is not in the
 * format fails. The reported name is the lexicographically first leftover,
 * matching std::map.
 *
 * check_format accepts "bytes". serialize_attribute matches "byte", not "bytes".
 * A "bytes" value therefore fails with "No type could be matched - bytes".
 * IPFS uses the base58 alphabet in include/base58.hpp. A character outside it
 * fails decode. Leading and trailing spaces are skipped by that decoder.
 */

export type FormatLine = { name: string; type: string };

export type Scalar =
  | { kind: "int"; bits: 8 | 16 | 32 | 64; value: number }
  | { kind: "uint"; bits: 8 | 16 | 32 | 64; value: number }
  | { kind: "float"; value: number }
  | { kind: "double"; value: number }
  | { kind: "string"; value: string };

export type Value = ({ name: string } & Scalar) | { name: string; kind: "list"; items: Scalar[] };

export type ValueResult =
  | { ok: false; reason: string }
  | { ok: true; action: "serialize"; written: number };

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const RANGES: Record<string, [number, number]> = {
  int8: [-128, 127],
  int16: [-32768, 32767],
  int32: [-2147483648, 2147483647],
  uint8: [0, 255],
  uint16: [0, 65535],
  uint32: [0, 4294967295],
};

function expected(type: string): string {
  if (type === "bool") {
    return "Expected a bool (needs to be provided as uint8_t because of C++ restrictions), but got something else";
  }
  if (type === "ipfs") return "Expected a string (ipfs), but got something else";
  if (type === "fixed8" || type === "byte") return "Expected a uint8 (fixed8 / byte), but got something else";
  if (type === "fixed16") return "Expected a uint16 (fixed16), but got something else";
  if (type === "fixed32") return "Expected a uint32 (fixed32), but got something else";
  if (type === "fixed64") return "Expected a uint64 (fixed64), but got something else";
  if (type === "string" || type === "image") return "Expected a string, but got something else";
  if (/^(?:int|uint)(?:8|16|32|64)$/.test(type) || type === "float" || type === "double") {
    return `Expected a ${type}, but got something else`;
  }
  return `No type could be matched - ${type}`;
}

function scalarOk(type: string, value: Scalar): string | null {
  if (type === "bytes" || type.endsWith("[]")) return `No type could be matched - ${type}`;
  if (type === "bool") {
    if (!(value.kind === "uint" && value.bits === 8)) return expected(type);
    if (value.value !== 0 && value.value !== 1) {
      return "Bools need to be provided as an uin8_t that is either 0 or 1";
    }
    return null;
  }
  if (type === "ipfs") {
    if (value.kind !== "string") return expected(type);
    const body = value.value.trim();
    if ([...body].some((ch) => !B58.includes(ch))) return "Error when decoding IPFS string";
    return null;
  }
  if (type === "string" || type === "image") return value.kind === "string" ? null : expected(type);
  if (type === "float") return value.kind === "float" ? null : expected(type);
  if (type === "double") return value.kind === "double" ? null : expected(type);
  const uintBits: Record<string, 8 | 16 | 32 | 64> = {
    uint8: 8, fixed8: 8, byte: 8,
    uint16: 16, fixed16: 16,
    uint32: 32, fixed32: 32,
    uint64: 64, fixed64: 64,
  };
  const intBits: Record<string, 8 | 16 | 32 | 64> = { int8: 8, int16: 16, int32: 32, int64: 64 };
  if (type in uintBits) {
    if (!(value.kind === "uint" && value.bits === uintBits[type])) return expected(type);
    const range = RANGES[type.startsWith("fixed") || type === "byte" ? `uint${uintBits[type]}` : type];
    if (type !== "uint64" && type !== "fixed64" && range && (value.value < range[0] || value.value > range[1])) {
      return expected(type);
    }
    return null;
  }
  if (type in intBits) {
    if (!(value.kind === "int" && value.bits === intBits[type])) return expected(type);
    const range = RANGES[type];
    if (type !== "int64" && range && (value.value < range[0] || value.value > range[1])) return expected(type);
    return null;
  }
  return `No type could be matched - ${type}`;
}

export function previewAttributeValues(format: readonly FormatLine[], values: readonly Value[]): ValueResult {
  const byName = new Map(format.map((line) => [line.name, line.type]));
  const used = new Set<string>();
  let written = 0;
  for (const value of values) {
    const type = byName.get(value.name);
    if (!type) continue;
    used.add(value.name);
    if (type.endsWith("[]")) {
      if (value.kind !== "list") return { ok: false, reason: `No type could be matched - ${type}` };
      const base = type.slice(0, -2);
      for (const item of value.items) {
        const bad = scalarOk(base, item);
        if (bad) return { ok: false, reason: bad };
      }
    } else {
      if (value.kind === "list") return { ok: false, reason: expected(type) };
      const bad = scalarOk(type, value);
      if (bad) return { ok: false, reason: bad };
    }
    written += 1;
  }
  const leftover = values.map((value) => value.name).filter((name) => !used.has(name)).sort();
  if (leftover.length > 0) {
    return {
      ok: false,
      reason: "The following attribute could not be serialized, because it is not specified in the provided format: " + leftover[0],
    };
  }
  return { ok: true, action: "serialize", written };
}
