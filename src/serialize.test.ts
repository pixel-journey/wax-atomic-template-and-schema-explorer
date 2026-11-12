import { describe, expect, it } from "vitest";
import { previewAttributeBytes, previewDataBlob } from "./serialize";

describe("attribute bytes", () => {
  it("prefixes the format index and varint-lengths a string", () => {
    expect(previewAttributeBytes({ formatIndex: 0, kind: "string", text: "Pixal" })).toEqual({
      ok: true,
      hex: "0405506978616c",
    });
    expect(previewAttributeBytes({ formatIndex: 1, kind: "bool", number: 1 })).toEqual({ ok: true, hex: "0501" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "uint8", number: 255 })).toEqual({ ok: true, hex: "04ff01" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "uint64", uint64: "128" })).toEqual({ ok: true, hex: "048001" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "ipfs", text: "2" })).toEqual({ ok: true, hex: "040101" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "ipfs", text: "1" })).toEqual({ ok: true, hex: "040100" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "uint16", number: 65535 })).toEqual({ ok: true, hex: "04ffff03" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "int16", number: -2 })).toEqual({ ok: true, hex: "0403" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "int64", signed: "-2" })).toEqual({ ok: true, hex: "0403" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "int64[]", signeds: ["-2"] })).toEqual({
      ok: true,
      hex: "040103",
    });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "uint64[]", uints: ["128"] })).toEqual({
      ok: true,
      hex: "04018001",
    });
  });

  it("keeps the format index when earlier lines are omitted", () => {
    expect(previewAttributeBytes({ formatIndex: 2, kind: "image", text: "a" }).hex).toBe("060161");
  });

  it("concatenates a blob in format order and skips a missing line", () => {
    const format = [{ name: "name", type: "string" }, { name: "alive", type: "bool" }];
    expect(previewDataBlob(format, [
      { name: "alive", kind: "bool", number: 1 },
      { name: "name", kind: "string", text: "Pixal" },
    ])).toEqual({ ok: true, hex: "0405506978616c0501" });
    expect(previewDataBlob(format, [{ name: "alive", kind: "bool", number: 1 }]).hex).toBe("0501");
    expect(previewDataBlob(format, [
      { name: "name", kind: "string", text: "Pixal" },
      { name: "zeta", kind: "string", text: "z" },
    ]).reason).toContain("zeta");
  });
});
