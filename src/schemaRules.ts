/**
 * Schema and template rules from atomicassets-contract tag v2.0.0.
 * Source: src/atomicassets.cpp (internal_create_template, setschematyp).
 * Not compiled. Not executed. Not a broadcast.
 *
 * Official reading:
 * - Contract: https://github.com/atomicassets/atomicassets-contract/tree/v2.0.0
 * - Release: https://github.com/atomicassets/atomicassets-contract/releases/tag/v2.0.0
 * - WAX docs: https://docs.wax.io/build/tutorials/howto_atomicassets
 * - Templates: https://docs.wax.io/build/tutorials/howto_atomicassets/templates_js
 */

export type TemplateFlags =
  | { ok: false; reason: string }
  | { ok: true; transferable: boolean; burnable: boolean };

/** The contract refuses a template that can neither move nor burn. */
export function previewCreateTemplate(transferable: boolean, burnable: boolean): TemplateFlags {
  if (!burnable && !transferable) {
    return { ok: false, reason: "A template cannot be both non-transferable and non-burnable" };
  }
  return { ok: true, transferable, burnable };
}

/**
 * setschematyp replaces the entire descriptor array.
 * A partial write drops every field you did not include.
 * This function models that: the returned list is exactly the input, not a merge.
 */
export type SchemaTypeWrite =
  | { ok: false; reason: string }
  | { ok: true; written: readonly string[]; dropped: readonly string[] };

export function previewSetSchemaTypes(
  current: readonly string[],
  next: readonly string[],
): SchemaTypeWrite {
  const unique = new Set(next);
  if (unique.size !== next.length) {
    return { ok: false, reason: "schema type names must be unique" };
  }
  for (const name of next) {
    if (!current.includes(name)) {
      return { ok: false, reason: `${name} is not in the current schema format` };
    }
  }
  const dropped = current.filter((name) => !next.includes(name));
  return { ok: true, written: [...next], dropped };
}
