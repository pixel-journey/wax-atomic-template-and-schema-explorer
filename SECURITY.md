# Security — schema explorer

## Closed in the teaching rules

| Issue | Behavior |
| --- | --- |
| Unknown format | not invented; mark custom |
| Live loader | read-only |
| Kind mismatch | handed to the mutable primitives lab; this explorer does not write |

## Not closed

| Concern | Guidance |
| --- | --- |
| Live collection rows | Host reads; tests should not require mainnet |
| `setassetdata` | Full-map replace is the mutable stack |

## Attack angles

1. Inventing a format type so a fixture passes.  
2. Writing `setassetdata` from the explorer and wiping sibling keys.  
3. Treating a not-found schema as a successful empty template.

## Honesty limits

Read-only teaching surface. No wasm.
