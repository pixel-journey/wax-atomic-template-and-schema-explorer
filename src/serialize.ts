/**
 * One attribute inside atomicdata::serialize, tag v2.0.0.
 * The identifier is toVarintBytes(formatIndex + 4). Skipped lines still
 * consume an index. This is not the whole immutable_data blob.
 * Not checked against a node.
 */

function varint(number: number): number[] {
  return varintBig(BigInt(number));
}

function varintBig(number: bigint): number[] {
  const bytes: number[] = [];
  let rest = number;
  while (rest >= 128n) {
    bytes.push(Number(128n + (rest % 128n)));
    rest /= 128n;
  }
  bytes.push(Number(rest));
  return bytes;
}

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function decodeBase58(text: string): number[] | null {
  let i = 0;
  while (i < text.length && /\s/.test(text[i] ?? "")) i += 1;
  let zeroes = 0;
  while (text[i] === "1") {
    zeroes += 1;
    i += 1;
  }
  const body = text.slice(i).trimEnd();
  if ([...body].some((ch) => !B58.includes(ch))) return null;
  const size = Math.floor((body.length * 733) / 1000) + 1;
  const b256 = new Array<number>(size).fill(0);
  let length = 0;
  for (const ch of body) {
    let carry = B58.indexOf(ch);
    let n = 0;
    for (let at = b256.length - 1; (carry !== 0 || n < length) && at >= 0; at -= 1, n += 1) {
      carry += 58 * (b256[at] ?? 0);
      b256[at] = carry % 256;
      carry = Math.floor(carry / 256);
    }
    length = n;
  }
  const start = size - length;
  return [...new Array<number>(zeroes).fill(0), ...b256.slice(start)];
}

export type Bytes =
  | { ok: false; reason: string }
  | { ok: true; hex: string };

function zigzag(value: number): number {
  return value < 0 ? (-1 * (value + 1)) * 2 + 1 : value * 2;
}

export function previewAttributeBytes(input: {
  formatIndex: number;
  kind: "string" | "image" | "bool" | "uint8" | "uint16" | "uint32" | "int8" | "int16" | "int32" | "int64" | "uint64" | "ipfs" | "float" | "double" | "uint8[]" | "int8[]" | "int16[]" | "uint16[]" | "uint32[]" | "int64[]" | "uint64[]" | "float[]" | "double[]" | "string[]";
  text?: string;
  number?: number;
  uint64?: string;
  signed?: string;
  list?: number[];
  texts?: string[];
  signeds?: string[];
  uints?: string[];
}): Bytes {
  if (input.formatIndex < 0) return { ok: false, reason: "format index must be the schema line, starting at 0" };
  const ident = varint(input.formatIndex + 4);
  let body: number[] = [];
  if (input.kind === "string" || input.kind === "image") {
    const text = Buffer.from(input.text ?? "", "utf8");
    body = [...varint(text.length), ...text];
  } else if (input.kind === "bool") {
    if (input.number !== 0 && input.number !== 1) {
      return { ok: false, reason: "Bools need to be provided as an uin8_t that is either 0 or 1" };
    }
    body = [input.number];
  } else if (input.kind === "uint8") {
    if (input.number === undefined || input.number < 0 || input.number > 255) {
      return { ok: false, reason: "Expected a uint8, but got something else" };
    }
    body = varint(input.number & 0xff);
  } else if (input.kind === "uint16" || input.kind === "uint32") {
    const max = input.kind === "uint16" ? 65535 : 4294967295;
    if (input.number === undefined || input.number < 0 || input.number > max || !Number.isInteger(input.number)) {
      return { ok: false, reason: `Expected a ${input.kind}, but got something else` };
    }
    const bits = input.kind === "uint16" ? 16 : 32;
    body = varintBig(BigInt(input.number) & ((1n << BigInt(bits)) - 1n));
  } else if (input.kind === "int8") {
    if (input.number === undefined || input.number < -128 || input.number > 127) {
      return { ok: false, reason: "Expected a int8, but got something else" };
    }
    body = varint(zigzag(input.number) & 0xff);
  } else if (input.kind === "int16" || input.kind === "int32") {
    const min = input.kind === "int16" ? -32768 : -2147483648;
    const max = input.kind === "int16" ? 32767 : 2147483647;
    if (input.number === undefined || input.number < min || input.number > max || !Number.isInteger(input.number)) {
      return { ok: false, reason: `Expected a ${input.kind}, but got something else` };
    }
    const bits = input.kind === "int16" ? 16 : 32;
    const zigzagged = input.number < 0 ? BigInt(-1 * (input.number + 1)) * 2n + 1n : BigInt(input.number) * 2n;
    body = varintBig(zigzagged & ((1n << BigInt(bits)) - 1n));
  } else if (input.kind === "int64") {
    if (!/^-?(0|[1-9][0-9]{0,18})$/.test(input.signed ?? "")) {
      return { ok: false, reason: "Expected a int64, but got something else" };
    }
    const value = BigInt(input.signed ?? "0");
    if (value < -9223372036854775808n || value > 9223372036854775807n) {
      return { ok: false, reason: "Expected a int64, but got something else" };
    }
    const zigzagged = value < 0n ? (-1n * (value + 1n)) * 2n + 1n : value * 2n;
    body = varintBig(zigzagged);
  } else if (input.kind === "uint64") {
    if (!/^(0|[1-9][0-9]{0,19})$/.test(input.uint64 ?? "")) {
      return { ok: false, reason: "Expected a uint64, but got something else" };
    }
    const value = BigInt(input.uint64 ?? "0");
    if (value > 18446744073709551615n) return { ok: false, reason: "Expected a uint64, but got something else" };
    body = varintBig(value);
  } else if (input.kind === "float") {
    if (input.number === undefined || !Number.isFinite(input.number)) {
      return { ok: false, reason: "Expected a float, but got something else" };
    }
    const buf = Buffer.alloc(4);
    buf.writeFloatLE(input.number);
    body = [...buf];
  } else if (input.kind === "double") {
    if (input.number === undefined || !Number.isFinite(input.number)) {
      return { ok: false, reason: "Expected a double, but got something else" };
    }
    const wide = Buffer.alloc(8);
    wide.writeDoubleLE(input.number);
    body = [...wide];
  } else if (input.kind === "uint8[]") {
    const list = input.list ?? [];
    if (list.some((item) => !Number.isInteger(item) || item < 0 || item > 255)) {
      return { ok: false, reason: "Expected a uint8, but got something else" };
    }
    body = [...varint(list.length)];
    for (const item of list) body.push(...varint(item & 0xff));
  } else if (input.kind === "int8[]" || input.kind === "int16[]" || input.kind === "uint16[]" || input.kind === "uint32[]") {
    const list = input.list ?? [];
    const spec = {
      "int8[]": { min: -128, max: 127, bits: 8, signed: true },
      "int16[]": { min: -32768, max: 32767, bits: 16, signed: true },
      "uint16[]": { min: 0, max: 65535, bits: 16, signed: false },
      "uint32[]": { min: 0, max: 4294967295, bits: 32, signed: false },
    }[input.kind];
    body = [...varint(list.length)];
    for (const item of list) {
      if (!Number.isInteger(item) || item < spec.min || item > spec.max) {
        return { ok: false, reason: `Expected a ${input.kind.slice(0, -2)}, but got something else` };
      }
      const zigzagged = spec.signed
        ? item < 0 ? BigInt(-1 * (item + 1)) * 2n + 1n : BigInt(item) * 2n
        : BigInt(item);
      body.push(...varintBig(zigzagged & ((1n << BigInt(spec.bits)) - 1n)));
    }
  } else if (input.kind === "float[]" || input.kind === "double[]") {
    const list = input.list ?? [];
    if (list.some((item) => !Number.isFinite(item))) {
      return { ok: false, reason: `Expected a ${input.kind.slice(0, -2)}, but got something else` };
    }
    body = [...varint(list.length)];
    for (const item of list) {
      const buf = Buffer.alloc(input.kind === "float[]" ? 4 : 8);
      if (input.kind === "float[]") buf.writeFloatLE(item);
      else buf.writeDoubleLE(item);
      body.push(...buf);
    }
  } else if (input.kind === "int64[]" || input.kind === "uint64[]") {
    const items = input.kind === "int64[]" ? input.signeds ?? [] : input.uints ?? [];
    const pattern = input.kind === "int64[]" ? /^-?(0|[1-9][0-9]{0,18})$/ : /^(0|[1-9][0-9]{0,19})$/;
    body = [...varint(items.length)];
    for (const item of items) {
      if (!pattern.test(item)) {
        return { ok: false, reason: `Expected a ${input.kind === "int64[]" ? "int64" : "uint64"}, but got something else` };
      }
      const value = BigInt(item);
      if (input.kind === "int64[]") {
        if (value < -9223372036854775808n || value > 9223372036854775807n) {
          return { ok: false, reason: "Expected a int64, but got something else" };
        }
        const zigzagged = value < 0n ? (-1n * (value + 1n)) * 2n + 1n : value * 2n;
        body.push(...varintBig(zigzagged));
      } else {
        if (value > 18446744073709551615n) return { ok: false, reason: "Expected a uint64, but got something else" };
        body.push(...varintBig(value));
      }
    }
  } else if (input.kind === "string[]") {
    const texts = input.texts ?? [];
    body = [...varint(texts.length)];
    for (const text of texts) {
      const bytes = Buffer.from(text, "utf8");
      body.push(...varint(bytes.length), ...bytes);
    }
  } else {
    const decoded = decodeBase58(input.text ?? "");
    if (!decoded) return { ok: false, reason: "Error when decoding IPFS string" };
    body = [...varint(decoded.length), ...decoded];
  }
  return { ok: true, hex: Buffer.from([...ident, ...body]).toString("hex") };
}

const PACKED = new Set(["string", "image", "bool", "uint8", "uint16", "uint32", "int8", "int16", "int32", "int64", "uint64", "ipfs", "float", "double", "uint8[]", "int8[]", "int16[]", "uint16[]", "uint32[]", "int64[]", "uint64[]", "float[]", "double[]", "string[]"]);

export type BlobValue = {
  name: string;
  kind: "string" | "image" | "bool" | "uint8" | "uint16" | "uint32" | "int8" | "int16" | "int32" | "int64" | "uint64" | "ipfs" | "float" | "double" | "uint8[]" | "int8[]" | "int16[]" | "uint16[]" | "uint32[]" | "int64[]" | "uint64[]" | "float[]" | "double[]" | "string[]";
  text?: string;
  number?: number;
  uint64?: string;
  signed?: string;
  list?: number[];
  texts?: string[];
  signeds?: string[];
  uints?: string[];
};

export function previewDataBlob(
  format: readonly { name: string; type: string }[],
  values: readonly BlobValue[],
): Bytes {
  const byName = new Map(format.map((line, index) => [line.name, { ...line, index }]));
  const used = new Set<string>();
  const parts: Buffer[] = [];
  for (const line of format) {
    const value = values.find((item) => item.name === line.name);
    if (!value) continue;
    used.add(line.name);
    if (!PACKED.has(line.type) || value.kind !== line.type) {
      return { ok: false, reason: `this preview packs string, image, bool, the uint sizes, int8, ipfs, and float. ${line.type} is not packed here` };
    }
    const piece = previewAttributeBytes({
      formatIndex: byName.get(line.name)?.index ?? 0,
      kind: value.kind,
      text: value.text,
      number: value.number,
      uint64: value.uint64,
      list: value.list,
      signed: value.signed,
      texts: value.texts,
      signeds: value.signeds,
      uints: value.uints,
    });
    if (!piece.ok) return piece;
    parts.push(Buffer.from(piece.hex, "hex"));
  }
  const leftover = values.map((value) => value.name).filter((name) => !used.has(name)).sort();
  if (leftover[0]) {
    return {
      ok: false,
      reason:
        "The following attribute could not be serialized, because it is not specified in the provided format: " +
        leftover[0],
    };
  }
  return { ok: true, hex: Buffer.concat(parts).toString("hex") };
}

