# v2 notes — schemas and templates

**Trust:** this repo's verification log says the explorer is untested. These notes are the v2.0.0 release, not a local assert.

From [atomicassets-contract v2.0.0](https://github.com/atomicassets/atomicassets-contract/releases/tag/v2.0.0) (2026-08-03):

- `setschematyp` replaces the **entire** descriptor array in `schematypes`. Read the current row, then write. A partial write wipes the fields you forgot.
- Per-field media types live in that table. They are not a new schema format string.
- `createtempl` / `createtempl2` reject a template that is both non-transferable and non-burnable (`A template cannot be both non-transferable and non-burnable`). That asset could never move and never burn, so its RAM would stick. Templates already in that state keep working. The check is at creation.
- Mutable template data is `templates2` plus `settempldata`. "Immutable vs mutable" in the README is the product idea. The v2 table names are the contract idea. Do not pretend this repo reads `templates2`.
- `redtemplmax` lowers `max_supply`. `deltemplate` removes an empty template.
- `mintasset` rejects a non-empty `tokens_to_back`. Do not add a backing field to the mint form.

Full map: [ATOMICASSETS-V2.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ATOMICASSETS-V2.md).
