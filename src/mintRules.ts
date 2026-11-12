/**
 * mintasset, createschema, and extendschema from atomicassets-contract tag v2.0.0
 * src/atomicassets.cpp. Not compiled. Not executed.
 * Collection auth and attribute serialization are not checked.
 *
 * Official reading:
 * - https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft
 * - https://docs.wax.io/build/tutorials/howto_atomicassets
 * - https://github.com/atomicassets/atomicassets-contract/tree/v2.0.0
 *
 * The WAX mint guide still lists tokens_to_back. The v2 cpp refuses a non-empty vector
 * with "Native backing has been deprecated on the AtomicAssets Contract".
 * That check sits after the logmint action is queued. This preview refuses the list
 * and does not send a log.
 */

export type MintTemplate = {
  schema: string;
  issuedSupply: number;
  maxSupply: number;
};

export type MintResult =
  | { ok: false; reason: string }
  | { ok: true; action: "mintasset"; nextIssued: number | null };

export function previewMint(input: {
  schemaExists: boolean;
  schemaName: string;
  templateId: number;
  template: MintTemplate | null;
  tokensToBack: number;
}): MintResult {
  if (!input.schemaExists) return { ok: false, reason: "No schema with this name exists" };
  let nextIssued: number | null = null;
  if (input.templateId >= 0) {
    if (!input.template) return { ok: false, reason: "No template with this id exists" };
    if (input.template.schema !== input.schemaName) {
      return { ok: false, reason: "The template belongs to another schema" };
    }
    if (input.template.maxSupply > 0 && input.template.issuedSupply >= input.template.maxSupply) {
      return { ok: false, reason: "The template's maxsupply has already been reached" };
    }
    nextIssued = input.template.issuedSupply + 1;
  } else if (input.templateId !== -1) {
    return { ok: false, reason: "The template id must either be an existing template or -1" };
  }
  if (input.tokensToBack !== 0) {
    return { ok: false, reason: "Native backing has been deprecated on the AtomicAssets Contract" };
  }
  return { ok: true, action: "mintasset", nextIssued };
}

export type SchemaResult =
  | { ok: false; reason: string }
  | { ok: true; action: "createschema" | "extendschema"; lines: number };

/** String length, not eosio name encoding. */
export function previewCreateSchema(name: string, alreadyExists: boolean, lineCount: number): SchemaResult {
  if (name.length < 1 || name.length > 12) {
    return { ok: false, reason: "Schema names must be between 1 and 12 characters long" };
  }
  if (alreadyExists) {
    return { ok: false, reason: "A schema with this name already exists for this collection" };
  }
  return { ok: true, action: "createschema", lines: lineCount };
}

export function previewExtendSchema(exists: boolean, currentLines: number, added: number): SchemaResult {
  if (added <= 0) return { ok: false, reason: "Need to add at least one new line" };
  if (!exists) return { ok: false, reason: "No schema with this name exists for this collection" };
  return { ok: true, action: "extendschema", lines: currentLines + added };
}
