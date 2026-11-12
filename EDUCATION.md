# Schemas and templates — the data foundation of an AtomicAssets collection

**Trust:** `educational-reference`. The pure functions in `src/schemaRules.ts` are tested. The React explorer is not. Nothing here is a broadcast.

Official reading, still live:

- [How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) on docs.wax.io
- [Managing AA Templates](https://docs.wax.io/build/tutorials/howto_atomicassets/templates_js)
- [Minting atomicassets NFTs](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft)
- [atomicassets-contract v2.0.0](https://github.com/atomicassets/atomicassets-contract/releases/tag/v2.0.0) — the source these previews were read from
- [ATOMICASSETS-V2.md](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ATOMICASSETS-V2.md) in the catalog

This is the home for schema and template rules. Author succession, RAM payer, and offer shape live in [wax-atomicassets-v2-action-previews](https://github.com/pixel-journey/wax-atomicassets-v2-action-previews). Collection fee and auth lists live in [wax-atomic-collection-config-visualizer](https://github.com/pixel-journey/wax-atomic-collection-config-visualizer). Do not open a new micro-repo for a single check that belongs here.

---

## Scene

You are writing a mint form. The schema has `name`, `img`, and `rarity`. A designer wants to "just update the media type on name" and sends `setschematyp` with only `name`. The contract replaces the whole array. `img` and `rarity` disappear from the type table. Separately, someone tries to create a template that is neither transferable nor burnable. The contract refuses it at creation so the RAM cannot stick forever.

Predict, then run:

```bash
npm test
```

---

## Beginner — the four layers

| Layer | What it is | Official action |
| --- | --- | --- |
| Collection | The container. Author, auth list, market fee. | `createcol` |
| Schema | The attribute dictionary for a collection. | `createschema`, `extendschema`, `setschematyp` |
| Template | A concrete blueprint: flags, max supply, immutable data. | `createtempl`, `createtempl2`, `settempldata`, `locktemplate`, `redtemplmax`, `deltemplate` |
| Asset | One minted instance. | `mintasset` |

The WAX docs walk the same layers in [Managing AA Templates](https://docs.wax.io/build/tutorials/howto_atomicassets/templates_js). That page still shows `tokens_to_back` on mint. AtomicAssets v2 rejects a non-empty list. Leave it `[]`.

---

## Intermediate — the two rules this course locks

### Template flags

The contract check is `burnable || transferable`. Both false is refused with the string `A template cannot be both non-transferable and non-burnable`. The other three pairs succeed. The check is at creation. An already-stored template in that state is not deleted.

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Non-transferable and non-burnable | allow both false | refuse with the contract string | `previewCreateTemplate(false, false)` |
| Non-transferable but burnable | refuse both | allow | `previewCreateTemplate(false, true)` |
| Treat the ban as retroactive | delete old rows | not modeled | the function has no table |

### Schema type overwrite

`setschematyp` writes the entire descriptor array. A partial list is not a merge. Fields you omit are dropped from the type table. The format strings themselves live on the schema; the type table is a separate row.

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Send only the field you changed | merge | the returned list is exactly the input; dropped fields are reported | `["name","img","rarity"]` → `["name","img"]` drops `rarity` |
| Name a type that is not in the format | invent a field | refuse | `video` is not in `["name"]` |
| Repeat a type name | accept | refuse | `["name","name"]` |

---

## Masterclass — what the explorer does not do

- It does not read `templates2`. Mutable template data is that table plus `settempldata`. The README's "immutable vs mutable" line is the product idea. The table names are the contract idea.
- It does not lower `max_supply` (`redtemplmax`) or remove an empty template (`deltemplate`). Those are listed in [V2-NOTES.md](./V2-NOTES.md) and not previewed here yet.
- It does not mint. Minting is [wax-drops-and-pack-opening-experience](https://github.com/pixel-journey/wax-drops-and-pack-opening-experience) for pack flows and the WAX [mint guide](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft) for the action shape.
- Native backing is deprecated. `backasset` fails in the v2 cpp. Holder splits are `equalSplit` and `duePayout` in [wax-nft-backed-token-unlock-visualizer](https://github.com/pixel-journey/wax-nft-backed-token-unlock-visualizer).

### What this course will not teach

- A broadcast, a RAM byte refund, or `is_account`
- `atomicdropsx::claimdrop` (the drops ABI was not verified)
- That a successful `previewSetSchemaTypes` means the type row would succeed on chain. Ownership of the collection and the authorized editor are not checked.
