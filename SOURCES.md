# Sources

| Source | Use |
| --- | --- |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Kind encodings |
| [atomicassets-sdk](https://github.com/atomicassets/atomicassets-sdk) | Official TypeScript path |
| [mutable primitives](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) | Kind mismatch does not mutate |
| [atomic-knowledge](https://github.com/atomicassets/atomic-knowledge) | Network before a live read |
| [wharfkit/skill](https://github.com/wharfkit/skill) | SessionKit only if a later host signs something else |

## Product facts

- `validateAgainstSchema` lists per-field failures. It does **not** invent format types.
- A new `KNOWN_FORMATS` entry needs an AtomicAssets document. Otherwise mark it custom.
- Live loaders stay **read-only**. Not-found is a calm empty state.
- `setassetdata` full-map replace belongs to the mutable stack, not this explorer.

## Portability

The validation pattern ports. Schema and template rows are chain-local and ABI-local.
