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

## Supply — delete, lock, reduce

`previewDeleteTemplate` succeeds only when `issuedSupply` is 0 (`Can't delete a template that has any assets issued`).

`previewLockTemplate` sets `maxSupply` to `issuedSupply`. A negative id returns `The template id must be positive`. Zero issued returns `Can't lock a template that does not have at least one issued asset`.

`previewReduceMax` refuses 0 (`The new max supply can't be set to zero (infinite)`), a value below issued supply, and a value that is not strictly lower than a finite current max. An infinite max (`0`) can be lowered to any positive number at or above the issued count.

`previewDisplayName` refuses a `name` string longer than 64. A missing name is allowed. `previewSetTemplateData` then either does nothing (no row and empty data), creates the mutable row, replaces it, or deletes it when the new map is empty. The immutable template stays. Collection auth is not checked, and `logsetdatatl` is not sent. Deposit and withdraw of old balances live in [wax-nft-backed-token-unlock-visualizer](https://github.com/pixel-journey/wax-nft-backed-token-unlock-visualizer).

---

## Who this is for

- **Creators.** A schema is the dictionary (`name`, `img`, `rarity`). A template is one edition: flags, max supply, the immutable picture. An asset is one copy. [Managing AA Templates](https://docs.wax.io/build/tutorials/howto_atomicassets/templates_js) walks the happy path. This course is the refusals.
- **Artists.** Immutable data is the print. Mutable data is the only field you can change later, and the editor who writes it becomes the RAM payer. That move is `preview`ed in [wax-atomicassets-v2-action-previews](https://github.com/pixel-journey/wax-atomicassets-v2-action-previews), not here. Media types (`image`, a 3D file hint) live in `setschematyp`, which replaces the whole descriptor list.
- **Developers and anyone generating the transaction.** `template_id` is an existing template or exactly `-1` (no template). `tokens_to_back` must be empty. The [mint guide](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft) still shows the parameter. v2 rejects a non-empty list.

## Mint and schema shape

`previewMint` refuses a missing schema, a missing template, a template from another schema, a reached max (`The template's maxsupply has already been reached` — one word), any id other than an existing template or `-1`, and any backed token (`Native backing has been deprecated on the AtomicAssets Contract`). An infinite max (`0`) does not hit the reached check. A successful mint of a real template returns `nextIssued` as current plus one. `-1` returns `nextIssued: null`.

`previewCreateSchema` uses string length 1–12, not eosio name encoding. A taken name fails. `previewExtendSchema` must add at least one line. `previewSchemaFormat` is the v2 `check_format` rule: a `name`/`string` line is required, names are unique and at most 64 characters, and a type is one scalar plus at most one `[]`. The header comment says `byte`. The code accepts `bytes` and rejects `byte`. Nested vectors fail.

`previewAttributeValues` is the next step, from `include/atomicdata.hpp`. It does not emit bytes. A format line you omit is skipped. A key that is not in the format fails, and the name in the message is the alphabetically first leftover. `image` is a string. `ipfs` is a string in the base58 alphabet from `include/base58.hpp` (`0`, `O`, `I`, and `l` are not in it). A bool is a `uint8` that is 0 or 1. The contract string says `uin8_t`. A schema type of `bytes` passes `check_format` and then fails serialization: `No type could be matched - bytes`. The serializer matches `byte`, which `check_format` will not let you store.

`previewAttributeBytes` emits one attribute. The first byte is `toVarintBytes(formatIndex + 4)`, so line 0 starts with `04`. A skipped earlier line still consumes its index: a value on line 2 starts with `06`. `Pixal` is `0405506978616c`. `uint8` 255 is `04ff01`, not a single `ff`. `int8` -1 is zigzagged to 1, so `0401`. `previewDataBlob` concatenates those pieces in schema order, not in the order you passed the values. A missing line is omitted and does not shift the later identifiers. `name` plus a bool is `0405506978616c0501`. An unknown key fails with the contract's leftover sentence. `uint64` 128 is `048001`. An IPFS value is the base58 decode from `include/base58.hpp`, length-prefixed. `"2"` is `040101`. `"1"` is a single zero byte, so `040100`. `"0"` is not in the alphabet. Only `string`, `image`, `bool`, the integer widths through `int64` and `uint64`, `ipfs`, `float`, `double`, `uint8[]`, and `string[]` are packed. `int16` -2 is zigzagged to 3, so `0403`. A `uint8[]` of `[1, 255]` is a count then each element: `040201ff01`. `int64` -2 is the same zigzag, stored as a decimal string so it is not rounded: `0403`. A `string[]` of `a` and `bb` is a count, then each string: `04020161026262`. `double` 1 is eight little-endian IEEE bytes: `04000000000000f03f`. The other vectors are not packed. The craft that burns one template and mints another, without calling the chain, is [px-blend-simple-nft-to-nft](https://github.com/pixel-journey/px-blend-simple-nft-to-nft). A slot that accepts any template in a schema is [px-blend-schema-wildcard-recipes](https://github.com/pixel-journey/px-blend-schema-wildcard-recipes). A craft that also spends PXJ is [px-blend-hybrid-ft-plus-nft](https://github.com/pixel-journey/px-blend-hybrid-ft-plus-nft). None of them calls the chain. The worked screens are [Minting NFTs](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft), [Managing collections](https://docs.wax.io/build/tutorials/howto_atomicassets/collection_js), and [Managing templates](https://docs.wax.io/build/tutorials/howto_atomicassets/templates_js). RAM for a row is charged by the node when the action is sent. This lab does not estimate that charge. These bytes were not checked on a node. RAM payer changes, including the `logrampayer` notification, live in [wax-atomicassets-v2-action-previews](https://github.com/pixel-journey/wax-atomicassets-v2-action-previews).

Collection authorization is not checked. A successful preview is not a transaction.

Pack opening and claim shapes are [wax-drops-and-pack-opening-experience](https://github.com/pixel-journey/wax-drops-and-pack-opening-experience). Holder cashback after backing was removed is [wax-nft-backed-token-unlock-visualizer](https://github.com/pixel-journey/wax-nft-backed-token-unlock-visualizer).

## Masterclass — what the explorer does not do

- It does not read `templates2`. Mutable template data is that table plus `settempldata`.
- Attribute bytes for the packed types are `previewAttributeBytes` and `previewDataBlob`. `double` and the remaining vectors are not packed. The bytes were not checked on a node.
- Transfer and burn of an already minted asset live in [wax-atomicassets-v2-action-previews](https://github.com/pixel-journey/wax-atomicassets-v2-action-previews).

### What this course will not teach

- A broadcast, a RAM byte refund, or `is_account`
- `atomicdropsx::claimdrop` (the drops ABI was not verified)
- That a successful `previewSetSchemaTypes` means the type row would succeed on chain. Ownership of the collection and the authorized editor are not checked.
