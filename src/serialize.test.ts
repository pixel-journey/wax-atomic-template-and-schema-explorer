import { describe, expect, it } from "vitest";
import { previewAttributeBytes } from "./serialize";

describe("attribute bytes", () => {
  it("prefixes the format index and varint-lengths a string", () => {
    expect(previewAttributeBytes({ formatIndex: 0, kind: "string", text: "Pixal" })).toEqual({
      ok: true,
      hex: "0405506978616c",
    });
    expect(previewAttributeBytes({ formatIndex: 1, kind: "bool", number: 1 })).toEqual({ ok: true, hex: "0501" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "uint8", number: 255 })).toEqual({ ok: true, hex: "04ff01" });
    expect(previewAttributeBytes({ formatIndex: 0, kind: "int8", number: -1 })).toEqual({ ok: true, hex: "0401" });
  });

  it("keeps the format index when earlier lines are omitted", () => {
    expect(previewAttributeBytes({ formatIndex: 2, kind: "image", text: "a" }).hex).toBe("060161");
  });
});
