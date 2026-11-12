import { describe, expect, it } from "vitest";
import { previewCreateTemplate, previewSetSchemaTypes } from "./schemaRules";

describe("schema and template rules", () => {
  it("refuses a template that can neither move nor burn", () => {
    expect(previewCreateTemplate(false, false)).toEqual({
      ok: false,
      reason: "A template cannot be both non-transferable and non-burnable",
    });
  });

  it("allows every other flag pair", () => {
    expect(previewCreateTemplate(true, true).ok).toBe(true);
    expect(previewCreateTemplate(true, false).ok).toBe(true);
    expect(previewCreateTemplate(false, true).ok).toBe(true);
  });

  it("replaces the whole type array and reports the dropped fields", () => {
    const result = previewSetSchemaTypes(["name", "img", "rarity"], ["name", "img"]);
    expect(result).toEqual({ ok: true, written: ["name", "img"], dropped: ["rarity"] });
  });

  it("refuses a type that is not in the current format", () => {
    expect(previewSetSchemaTypes(["name"], ["name", "video"])).toEqual({
      ok: false,
      reason: "video is not in the current schema format",
    });
  });

  it("refuses a repeated type name", () => {
    expect(previewSetSchemaTypes(["name", "img"], ["name", "name"]).ok).toBe(false);
  });
});
