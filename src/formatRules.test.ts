import { describe, expect, it } from "vitest";
import { previewSchemaFormat } from "./formatRules";

describe("schema format", () => {
  it("accepts a name line plus one vector type", () => {
    expect(previewSchemaFormat([
      { name: "name", type: "string" },
      { name: "img", type: "image" },
      { name: "stats", type: "uint64[]" },
    ])).toEqual({ ok: true, action: "check_format", lines: 3 });
  });

  it("refuses a missing name line, a nested vector, byte, and a duplicate", () => {
    expect(previewSchemaFormat([{ name: "img", type: "image" }]).ok).toBe(false);
    expect(previewSchemaFormat([
      { name: "name", type: "string" },
      { name: "ids", type: "uint64[][]" },
    ])).toEqual({ ok: false, reason: "'type' attribute has an invalid format - uint64[][]" });
    expect(previewSchemaFormat([
      { name: "name", type: "string" },
      { name: "blob", type: "byte" },
    ])).toEqual({ ok: false, reason: "'type' attribute has an invalid format - byte" });
    expect(previewSchemaFormat([
      { name: "name", type: "string" },
      { name: "name", type: "image" },
    ]).reason).toContain("same name");
  });
});
