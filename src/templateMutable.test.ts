import { describe, expect, it } from "vitest";
import { previewDisplayName, previewSetTemplateData } from "./templateMutable";

const row = { templateExists: true, schemaExists: true, hasMutableRow: false, valueCount: 1, displayName: "Pixal" };

describe("template mutable data", () => {
  it("refuses a display name longer than 64", () => {
    expect(previewDisplayName("a".repeat(64)).ok).toBe(true);
    expect(previewDisplayName("a".repeat(65))).toEqual({
      ok: false,
      reason: 'Names (attribute with name: "name") can only be 64 characters max',
    });
    expect(previewDisplayName(null).ok).toBe(true);
  });

  it("emplaces, modifies, erases, or leaves the row alone", () => {
    expect(previewSetTemplateData(row).effect).toBe("emplace");
    expect(previewSetTemplateData({ ...row, hasMutableRow: true }).effect).toBe("modify");
    expect(previewSetTemplateData({ ...row, hasMutableRow: true, valueCount: 0 }).effect).toBe("erase");
    expect(previewSetTemplateData({ ...row, valueCount: 0 }).effect).toBe("unchanged");
  });

  it("refuses a missing template before it looks at the data", () => {
    expect(previewSetTemplateData({ ...row, templateExists: false })).toEqual({
      ok: false,
      reason: "No template with the specified id exists for the specified collection",
    });
  });
});
