# Verification Log

Honest record of what has and has not been tested.
Never mark something verified without running it and recording evidence.

## Status legend
- `VERIFIED` — ran against live endpoint or unit test
- `UNTESTED` — code exists, never executed
- `BROKEN` — ran, failed
- `N/A` — not applicable

## Claims in this repo
| Claim | Status | Evidence |
| --- | --- | --- |
| Pure schema format validators correctly reject invalid payloads | UNTESTED | examples/schemaFormats.ts |
| Template inspection separates immutable vs mutable data | UNTESTED | TemplateCard.tsx |
| Demo runs with mock data (zero network) | UNTESTED | examples/demo.tsx |
| Live AtomicAssets API path handles not-found calmly | UNTESTED | (if present) |

## How to verify
```bash
# Typecheck
npm run typecheck

# (Future) Unit tests on validators
# npx vitest run examples/schemaFormats.test.ts
```

**Trust label:** educational-reference
