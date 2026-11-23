# AI handoff — Atomic template and schema explorer

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
# https://github.com/atomicassets/atomic-knowledge — pin commit, AGENTS.md
```

| Source | Role |
| --- | --- |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Kind encodings |
| [atomicassets-sdk](https://github.com/atomicassets/atomicassets-sdk) | Official TS path |
| [mutable primitives](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) | Kind mismatch non-mutating |
| [atomic-knowledge](https://github.com/atomicassets/atomic-knowledge) | Network before action |

## Non-negotiables

1. `validateAgainstSchema` — list per-field failures; **do not invent format types**.
2. Propose new `KNOWN_FORMATS` only if documented for AtomicAssets; otherwise mark custom.
3. Explorer stays **read-only** for live API loaders; handle not-found calmly.
4. Schema/template field lists are chain/ABI-local; validation pattern ports.
5. Pair with collection config and mutable stack — do not open a micro-repo for one format string.

## Prompt seeds

- "Using validateAgainstSchema, check this attribute object against [SCHEMA]."
- "Propose format [NAME] only if Atomic-documented; else custom."
- "Add read-only loader for schemas/templates of collection [NAME]."
- "Hand kind mismatch to mutable primitives lab."

## Do not

- Invent format types.
- Write setassetdata from this explorer alone (mutable stack owns full-map rules).
- Claim live schema was mutated.
