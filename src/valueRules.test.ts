import { describe, expect, it } from "vitest";
import { previewAttributeValues } from "./valueRules";

const format = [
  { name: "name", type: "string" },
  { name: "img", type: "image" },
  { name: "alive", type: "bool" },
  { name: "cid", type: "ipfs" },
  { name: "stats", type: "uint64[]" },
];

describe("attribute values", () => {
  it("skips a missing line and writes the ones that match", () => {
    expect(previewAttributeValues(format, [
      { name: "name", kind: "string", value: "Pixal" },
      { name: "alive", kind: "uint", bits: 8, value: 1 },
    ])).toEqual({ ok: true, action: "serialize", written: 2 });
  });

  it("refuses a bool that is not 0 or 1, a bad IPFS character, and bytes", () => {
    expect(previewAttributeValues(
      [{ name: "name", type: "string" }, { name: "alive", type: "bool" }],
      [
        { name: "name", kind: "string", value: "Pixal" },
        { name: "alive", kind: "uint", bits: 8, value: 2 },
      ],
    )).toEqual({ ok: false, reason: "Bools need to be provided as an uin8_t that is either 0 or 1" });
    expect(previewAttributeValues(
      [{ name: "cid", type: "ipfs" }],
      [{ name: "cid", kind: "string", value: "Qm0" }],
    ).reason).toBe("Error when decoding IPFS string");
    expect(previewAttributeValues(
      [{ name: "blob", type: "bytes" }],
      [{ name: "blob", kind: "string", value: "aa" }],
    )).toEqual({ ok: false, reason: "No type could be matched - bytes" });
  });

  it("names the alphabetically first attribute that is not in the format", () => {
    const result = previewAttributeValues(
      [{ name: "name", type: "string" }],
      [
        { name: "name", kind: "string", value: "Pixal" },
        { name: "zeta", kind: "string", value: "z" },
        { name: "extra", kind: "string", value: "e" },
      ],
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason.endsWith("extra")).toBe(true);
  });
});
