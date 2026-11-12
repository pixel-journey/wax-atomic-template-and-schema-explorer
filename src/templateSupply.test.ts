import { describe, expect, it } from "vitest";
import { previewDeleteTemplate, previewLockTemplate, previewReduceMax } from "./templateSupply";

describe("template supply", () => {
  it("deletes only an empty template", () => {
    expect(previewDeleteTemplate({ issuedSupply: 0, maxSupply: 10 })).toEqual({
      ok: true,
      action: "deltemplate",
      maxSupply: null,
    });
    expect(previewDeleteTemplate({ issuedSupply: 1, maxSupply: 10 })).toEqual({
      ok: false,
      reason: "Can't delete a template that has any assets issued",
    });
  });

  it("locks by setting max supply to the issued count", () => {
    expect(previewLockTemplate(3, { issuedSupply: 4, maxSupply: 0 })).toEqual({
      ok: true,
      action: "locktemplate",
      maxSupply: 4,
    });
    expect(previewLockTemplate(-1, { issuedSupply: 1, maxSupply: 0 })).toEqual({
      ok: false,
      reason: "The template id must be positive",
    });
    expect(previewLockTemplate(1, { issuedSupply: 0, maxSupply: 10 })).toEqual({
      ok: false,
      reason: "Can't lock a template that does not have at least one issued asset",
    });
  });

  it("lowers a finite or infinite max and refuses a raise or a zero", () => {
    expect(previewReduceMax({ issuedSupply: 2, maxSupply: 0 }, 5)).toEqual({
      ok: true,
      action: "redtemplmax",
      maxSupply: 5,
    });
    expect(previewReduceMax({ issuedSupply: 2, maxSupply: 10 }, 6)).toEqual({
      ok: true,
      action: "redtemplmax",
      maxSupply: 6,
    });
    expect(previewReduceMax({ issuedSupply: 2, maxSupply: 10 }, 0)).toEqual({
      ok: false,
      reason: "The new max supply can't be set to zero (infinite)",
    });
    expect(previewReduceMax({ issuedSupply: 8, maxSupply: 10 }, 4)).toEqual({
      ok: false,
      reason: "The new max supply can't be lower than the issued supply",
    });
    expect(previewReduceMax({ issuedSupply: 2, maxSupply: 6 }, 6)).toEqual({
      ok: false,
      reason: "The new max supply must be lower than the existing max supply",
    });
  });
});
