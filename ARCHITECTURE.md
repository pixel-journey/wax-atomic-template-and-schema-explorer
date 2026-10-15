# ARCHITECTURE.md — Atomic Template & Schema Explorer

---

## 1. Design Intent

Make AtomicAssets data models legible and checkable. Priorities:

1. **Clarity** — collection → schema → template is always obvious
2. **Validation before pain** — catch format/attribute issues client-side
3. **Read-first** — exploration does not require privileged keys
4. **Pure helpers** — format rules are testable TypeScript, not tribal knowledge
5. **Accessibility** — inspectors and errors work with keyboard and screen readers

---

## 2. Exploration & Validation Invariants

| # | Invariant | Rationale |
|---|-----------|-----------|
| 1 | Schema formats come from a documented reference set | Prevents invented types |
| 2 | Validation messages are human-readable | Developers fix issues faster |
| 3 | Immutable and mutable data are always labeled separately | Product and trust implications differ |
| 4 | Explorer UI does not imply write access | Avoids accidental “I thought I was only looking” confusion |
| 5 | Missing/not-found states are explicit | Silent empty panels hide API or ID errors |
| 6 | Accessibility is part of educational quality | |

---

## 3. Architecture

```
AtomicAssets API (optional live)
        │
        ▼
   Normalize → types.ts shapes
        │
        ▼
 schemaFormats.ts (pure validate / describe)
        │
        ├── SchemaInspector
        ├── TemplateCard
        └── ValidationPanel
```

---

## 4. Component Contracts

### SchemaInspector
- List attributes with format + optional description
- Flag unknown or risky formats

### TemplateCard
- Show template id, schema, max supply, is_transferable / is_burnable if known
- Separate immutable vs mutable data sections

### ValidationPanel
- Accept a candidate attribute object + schema definition
- Return pass/fail with per-field reasons via pure helpers

### schemaFormats (pure)
- Canonical list of common Atomic format strings
- `isKnownFormat`, `validateAttributeValue`, `validateAgainstSchema`

---

## 5. Data Flow

1. Load or paste schema / template data (fixture or API).
2. Normalize into shared types.
3. Inspect structure visually.
4. Optionally validate a sample payload.
5. Fix data model or client payload based on messages.

---

## 6. Extensions

- Live search across collections
- Relationship graph (schema shared by many templates)
- Example payload generator from schema
- Diff view for schema migrations (careful — migrations are hard on Atomic)

Preserve all invariants above.

---

*Pixel Journey — Beautiful interfaces for public blockchain data.*
