/**
 * deltemplate, locktemplate, redtemplmax from atomicassets-contract tag v2.0.0
 * src/atomicassets.cpp. Not compiled. Not executed. Not a broadcast.
 * Collection auth is not checked. The authorized editor is assumed already passed.
 *
 * Official reading:
 * - https://github.com/atomicassets/atomicassets-contract/tree/v2.0.0
 * - https://docs.wax.io/build/tutorials/howto_atomicassets/templates_js
 */

export type SupplyRow = { issuedSupply: number; maxSupply: number };

const MISSING = "No template with the specified id exists for the specified collection";

export type SupplyResult =
  | { ok: false; reason: string }
  | { ok: true; action: "deltemplate" | "locktemplate" | "redtemplmax"; maxSupply: number | null };

export function previewDeleteTemplate(row: SupplyRow | null): SupplyResult {
  if (!row) return { ok: false, reason: MISSING };
  if (row.issuedSupply !== 0) {
    return { ok: false, reason: "Can't delete a template that has any assets issued" };
  }
  return { ok: true, action: "deltemplate", maxSupply: null };
}

export function previewLockTemplate(templateId: number, row: SupplyRow | null): SupplyResult {
  if (templateId < 0) return { ok: false, reason: "The template id must be positive" };
  if (!row) return { ok: false, reason: MISSING };
  if (row.issuedSupply === 0) {
    return { ok: false, reason: "Can't lock a template that does not have at least one issued asset" };
  }
  return { ok: true, action: "locktemplate", maxSupply: row.issuedSupply };
}

export function previewReduceMax(row: SupplyRow | null, newMaxSupply: number): SupplyResult {
  if (!row) return { ok: false, reason: MISSING };
  if (newMaxSupply <= 0) {
    return { ok: false, reason: "The new max supply can't be set to zero (infinite)" };
  }
  if (row.issuedSupply > newMaxSupply) {
    return { ok: false, reason: "The new max supply can't be lower than the issued supply" };
  }
  if (!(row.maxSupply === 0 || row.maxSupply > newMaxSupply)) {
    return { ok: false, reason: "The new max supply must be lower than the existing max supply" };
  }
  return { ok: true, action: "redtemplmax", maxSupply: newMaxSupply };
}
