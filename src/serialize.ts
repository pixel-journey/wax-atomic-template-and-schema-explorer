/**
 * One attribute inside atomicdata::serialize, tag v2.0.0.
 * The identifier is toVarintBytes(formatIndex + 4). Skipped lines still
 * consume an index. This is not the whole immutable_data blob.
 * Not checked against a node.
 */

function varint(number: number): number[] {
  const bytes: number[] = [];
  let rest = number;
  while (rest >= 128) {
    bytes.push(128 + (rest % 128));
    rest = Math.floor(rest / 128);
  }
  bytes.push(rest);
  return bytes;
}

function zigzag(value: number): number {
  return value < 0 ? (-1 * (value + 1)) * 2 + 1 : value * 2;
}

export type Bytes =
  | { ok: false; reason: string }
  | { ok: true; hex: string };

export function previewAttributeBytes(input: {
  formatIndex: number;
  kind: "string" | "image" | "bool" | "uint8" | "int8";
  text?: string;
  number?: number;
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
  } else {
    if (input.number === undefined || input.number < -128 || input.number > 127) {
      return { ok: false, reason: "Expected a int8, but got something else" };
    }
    body = varint(zigzag(input.number) & 0xff);
  }
  return { ok: true, hex: Buffer.from([...ident, ...body]).toString("hex") };
}

const PACKED = new Set(["string", "image", "bool", "uint8", "int8"]);

export type BlobValue = {
  name: string;
  kind: "string" | "image" | "bool" | "uint8" | "int8";
  text?: string;
  number?: number;
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
      return { ok: false, reason: `this preview packs string, image, bool, uint8, and int8. ${line.type} is not packed here` };
    }
    const piece = previewAttributeBytes({
      formatIndex: byName.get(line.name)?.index ?? 0,
      kind: value.kind,
      text: value.text,
      number: value.number,
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

