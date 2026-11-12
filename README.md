# wax-atomic-template-and-schema-explorer

> **Home for schema, template, mint, and attribute values.** `setschematyp` replaces the whole descriptor array. A template cannot be both non-transferable and non-burnable. `deltemplate` needs zero issued. `locktemplate` sets max to issued. `redtemplmax` only lowers. `mintasset` refuses a full edition, a schema mismatch, any id other than a template or `-1`, and any `tokens_to_back`. `check_format` requires a `name`/`string` line. `bytes` passes that check and then fails serialization. The course is [EDUCATION.md](./EDUCATION.md). Transfer, burn, and mutable-data RAM live in [wax-atomicassets-v2-action-previews](https://github.com/pixel-journey/wax-atomicassets-v2-action-previews). Collection names and fees live in [wax-atomic-collection-config-visualizer](https://github.com/pixel-journey/wax-atomic-collection-config-visualizer). Pack flows live in [wax-drops-and-pack-opening-experience](https://github.com/pixel-journey/wax-drops-and-pack-opening-experience). Holder splits live in [wax-nft-backed-token-unlock-visualizer](https://github.com/pixel-journey/wax-nft-backed-token-unlock-visualizer). Do not open a new micro-repo for a single check that belongs here.

**Official sources, still live:**
- [How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets)
- [Managing AA Templates](https://docs.wax.io/build/tutorials/howto_atomicassets/templates_js)
- [Minting atomicassets NFTs](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft)
- [atomicassets-contract v2.0.0](https://github.com/atomicassets/atomicassets-contract/releases/tag/v2.0.0)

> **Trust Label:** `educational-reference`  
> **Verification:** The pure functions in `src/schemaRules.ts` are tested (`npm test`). The React explorer is not. See [VERIFICATION-LOG.md](VERIFICATION-LOG.md).

> **Status:** 🔄 Deep Refinement in Progress (PX Perfection Standard)  
> **Category:** Atomic Ecosystem – Templates, Schemas & Collection Data Models  
> **Parent Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)  
> **Related Perfected Foundations:** [pixel-journey-standards](https://github.com/pixel-journey/pixel-journey-standards) · [pixel-journey-templates](https://github.com/pixel-journey/pixel-journey-templates) · [gitbook-docs](https://github.com/pixel-journey/gitbook-docs)

**Goal:** An educational reference for AtomicAssets templates, schemas, and how a mint is refused. The React explorer is not the tested part. `npm test` is.

Templates and schemas are the data foundation of every Atomic collection. Misunderstanding them causes broken mint flows, painful migrations, and silent attribute bugs. This blueprint makes that foundation visible and checkable.

---

## Vision & Long-Term Participation Mindset

Most developers encounter Atomic templates as opaque JSON from an API. Schema format strings are easy to get wrong. Relationships between collection → schema → template → minted assets are rarely drawn clearly.

This toolkit exists so that:
- Creators can **see** what a schema actually allows
- Developers can **validate** attribute payloads before they hit the chain
- Teams can **explore** large collections without drowning in raw API responses

We build for long-term participants who treat data models as first-class product design, not an afterthought.

---

## Quick Starts

### For Human Developers
1. Read **§1 Educational Core** (schema formats, template vs schema).
2. Explore `/examples` — schema inspector, template card, validation panel.
3. Wire the pure validators to your mint / edit forms.
4. Adapt the explorer to AtomicAssets public APIs for live data.

### For AI Agents
1. Load `spec.yaml` first.
2. Use pure validation helpers; do not invent schema format semantics.
3. Keep exploration UI separate from any on-chain mutation path.

### For Collection Creators
1. Use the schema format reference and validation examples before freezing a schema.
2. Prefer explicit, documented attributes over “we will fix it later.”

---

## 1. Educational Core — Why Templates & Schemas Matter

### 1.1 Key Concepts

| Concept | Simple Explanation | Why It Matters |
|---------|--------------------|----------------|
| **Collection** | Namespace for assets, schemas, and templates | Ownership, config (transferable, burnable, etc.) |
| **Schema** | Named set of attribute *types* (format strings) | Defines what data is legal for templates under it |
| **Template** | Concrete blueprint: schema + max supply + immutable/mutable data | What players actually mint and trade |
| **Immutable vs mutable data** | Fixed at mint vs changeable later | Product design + trust |
| **Schema formats** | Atomic’s type system (`string`, `uint64`, `image`, …) | Wrong formats = failed mints or bad clients |

### 1.2 Common Pain Points

| Pain Point | Impact | How This Blueprint Helps |
|------------|--------|--------------------------|
| Opaque template JSON | Slow onboarding, mistakes | Structured cards + field breakdowns |
| Manual schema checks | Production attribute bugs | Pure client-side validators |
| No relationship view | Hard to see collection structure | Schema → template mapping views |
| Inconsistent format usage | Client and chain disagree | Format reference + validation messages |

### 1.3 Learning Outcomes

- Explain collection → schema → template → asset clearly
- Read and validate schema format strings
- Inspect template immutable/mutable data safely
- Build explorer UIs that reduce Atomic developer friction

---

## 2. Architecture & Design Decisions

### Recommended Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 + TypeScript (strict) |
| UI | Tailwind + Pixel Journey patterns |
| Data | AtomicAssets public APIs (when live) |
| Validation | Pure TypeScript helpers |
| Optional graph | React Flow or lightweight custom |

### Core Pieces

```
/examples/
  types.ts
  schemaFormats.ts      # Format reference + pure validators
  SchemaInspector.tsx
  TemplateCard.tsx
  ValidationPanel.tsx
  demo.tsx
```

### Design Decisions

- **Read-mostly explorer** — mutation (create schema/template) is out of scope for the core examples; focus is understanding and validation
- **Pure validation** — format checks run client-side with clear error strings
- **Honest empty states** — missing schema or template data is explained, not hidden

---

## 3. Integration Levels

| Level | Scope |
|-------|--------|
| **Minimal** | Format reference + single-schema validator |
| **Recommended** | Schema inspector + template cards + validation panel |
| **Advanced** | Live API explorer, relationship graph, export |

---

## 4. Best Practices & Anti-Patterns

**Do**
- Validate attribute payloads against the schema before mint previews
- Document immutable vs mutable intent for every attribute
- Keep schema formats conservative and well-known when possible

**Don’t**
- Treat API JSON as self-explanatory documentation
- Change schema semantics casually after assets exist
- Hide validation failures inside generic “mint failed” errors

### Production Readiness Checklist

- [ ] Schema format reference is accurate and linked from the UI
- [ ] Validators return human-readable reasons
- [ ] Template inspection separates immutable and mutable data
- [ ] Live API paths handle loading and not-found calmly
- [ ] Accessibility for search, lists, and validation messages

---

## 5. Machine / AI Instructions

See `spec.yaml` and `AI_PROMPTS.md`.

- Prefer pure validators over ad-hoc string checks
- Do not invent Atomic schema format types
- Keep explore/validate flows separate from any privileged create actions

---

## 6. Ecosystem Position

Companion to:
- `wax-atomic-collection-config-visualizer`
- `wax-blends-creator-and-visualizer`
- `wax-advanced-drop-mechanics-toolkit`

Foundational layer: `pixel-journey-standards`, `pixel-journey-templates`, `gitbook-docs`, `wax-ecosystem-blueprint-catalog`.

---

## 7. License & Credits

MIT License

**Pixel Journey** — Educational, practical, and beautiful interfaces for public blockchain infrastructure.

*Exemplifies the [PX Perfection Standard](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/PX-PERFECTION-STANDARD.md).*

*Last major refinement pass: October 2026*
