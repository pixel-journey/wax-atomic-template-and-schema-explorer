import { describe, expect, it } from "vitest";
import { previewCreateSchema, previewExtendSchema, previewMint } from "./mintRules";

const open = { schema: "player", issuedSupply: 2, maxSupply: 0 };
const capped = { schema: "player", issuedSupply: 5, maxSupply: 5 };

describe("mint and schema shape", () => {
  it("mints from an open template and from template id -1", () => {
    expect(previewMint({
      schemaExists: true,
      schemaName: "player",
      templateId: 4,
      template: open,
      tokensToBack: 0,
    })).toEqual({ ok: true, action: "mintasset", nextIssued: 3 });
    expect(previewMint({
      schemaExists: true,
      schemaName: "player",
      templateId: -1,
      template: null,
      tokensToBack: 0,
    })).toEqual({ ok: true, action: "mintasset", nextIssued: null });
  });

  it("refuses a full edition, a schema mismatch, a bad id, and any backed tokens", () => {
    expect(previewMint({
      schemaExists: true,
      schemaName: "player",
      templateId: 4,
      template: capped,
      tokensToBack: 0,
    })).toEqual({ ok: false, reason: "The template's maxsupply has already been reached" });
    expect(previewMint({
      schemaExists: true,
      schemaName: "player",
      templateId: 4,
      template: { ...open, schema: "item" },
      tokensToBack: 0,
    })).toEqual({ ok: false, reason: "The template belongs to another schema" });
    expect(previewMint({
      schemaExists: true,
      schemaName: "player",
      templateId: -2,
      template: null,
      tokensToBack: 0,
    })).toEqual({ ok: false, reason: "The template id must either be an existing template or -1" });
    expect(previewMint({
      schemaExists: true,
      schemaName: "player",
      templateId: -1,
      template: null,
      tokensToBack: 1,
    })).toEqual({ ok: false, reason: "Native backing has been deprecated on the AtomicAssets Contract" });
  });

  it("creates a schema of 1 to 12 characters and extends it by at least one line", () => {
    expect(previewCreateSchema("player", false, 3)).toEqual({ ok: true, action: "createschema", lines: 3 });
    expect(previewCreateSchema("", false, 1).ok).toBe(false);
    expect(previewCreateSchema("a".repeat(13), false, 1).ok).toBe(false);
    expect(previewCreateSchema("player", true, 1)).toEqual({
      ok: false,
      reason: "A schema with this name already exists for this collection",
    });
    expect(previewExtendSchema(true, 3, 1)).toEqual({ ok: true, action: "extendschema", lines: 4 });
    expect(previewExtendSchema(true, 3, 0)).toEqual({ ok: false, reason: "Need to add at least one new line" });
  });
});
