# wax-atomic-template-and-schema-explorer — Atomic Template & Schema Explorer

> **Status:** 🔒 Private (In Development) | Target Public Release: July 2026  
> **Category:** Atomic Ecosystem & Developer Tools (WAX-Specific)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**One-sentence goal:** An advanced visual explorer and validator for AtomicAssets templates, schemas, and collection configurations on WAX, with powerful search, validation, and visualization capabilities.

---

## 1. Overview & Goal

This blueprint delivers a powerful yet user-friendly interface for exploring, validating, and understanding AtomicAssets templates and schemas. It helps developers, creators, and analysts inspect template structures, validate configurations, visualize relationships, and debug issues quickly.

**Why it matters for WAX/Antelope:**
- Templates and schemas are fundamental to AtomicAssets but often difficult to explore and validate at scale.
- A high-quality explorer dramatically improves developer experience and reduces errors when working with complex collections.
- Pure client-side using public AtomicAssets APIs.

**Target users:**
- Developers building on AtomicAssets
- Collection creators and project teams
- Analysts and researchers studying template usage
- Anyone debugging or optimizing Atomic-based projects

**Success metrics:**
- Fast and intuitive exploration of templates and schemas
- Clear validation feedback and error highlighting
- 95+ Lighthouse scores
- High adoption by Atomic developers

---

## 2. Concepts & Inspiration

### Core Blockchain Concepts
- **AtomicAssets templates**: Define the structure and attributes of NFTs.
- **Schemas**: Define the data types and validation rules for template attributes.
- **Collection configurations**: Settings that govern how collections behave.
- **Client-side validation and visualization**: Running validation and rendering previews locally.

### User Pain Points Addressed
- Hard to understand complex template structures and relationships.
- Difficult to validate schemas before deploying or using them.
- Lack of good visualization tools for Atomic data models.

### Inspirations
- Traditional: Database schema explorers, API documentation tools (like Swagger/Postman), JSON schema validators.
- Web3: NFT metadata explorers, smart contract explorers.
- Design: Clean data exploration interfaces with strong search, filtering, and visualization.

**Related Blueprints (synergy):**
- Companion to `wax-atomic-markets-and-trading-interface`, `wax-blends-creator-and-visualizer`, and `wax-drops-and-pack-opening-experience`.
- Supports all Atomic-based tooling and education efforts.

---

## 3. Design Specifications (Pixel Journey Standards)

### 3.1 Visual & Interaction Design
- **Overall layout**: Clean explorer with powerful search and filters on the left. Main area shows template/schema details with tabs for structure, validation, examples, and relationships. Sidebar for quick actions and validation status. Professional developer aesthetic.
- **Color palette**: Professional indigo with clear success/warning/error states for validation.
- **Micro-interactions**: Smooth search results, satisfying expand/collapse of nested attributes, clear validation feedback.
- **Responsive**: Excellent desktop for detailed exploration; mobile-friendly summary views.

### 3.2 Key Views / Components
- `TemplateExplorer.tsx` — Main interface for browsing and searching templates.
- `SchemaViewer.tsx` — Detailed view of schema structure with validation.
- `ValidationPanel.tsx` — Real-time validation feedback and error reporting.
- `RelationshipGraph.tsx` — Visual graph showing relationships between templates and schemas.
- `ExampleDataPanel.tsx` — Sample data generation and preview.

### 3.3 Accessibility (A11y) & Inclusive Design
- WCAG 2.2 AA: Keyboard navigation, clear labels, high-contrast validation states.
- Screen reader friendly: Structured announcements of validation results and structure.

### 3.4 Performance & Optimization Targets
- Lighthouse 95+
- Fast loading and searching even with large numbers of templates
- Smooth interactions and visualizations
- Efficient API usage

---

## 4. Technical Architecture

### 4.1 Core Tech Stack (Standardized)
- **Framework:** Next.js 15 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui + framer-motion
- **State & Data:** @tanstack/react-query + zod + Jotai
- **Blockchain Data:** AtomicAssets APIs for templates, schemas, and collections
- **Visualization:** React Flow or custom components for relationship graphs
- **Utilities:** date-fns, lucide-react, sonner

### 4.2 Data Flow Diagram
```
Search or browse templates and schemas
    ↓
Load detailed structure and validation rules
    ↓
Run client-side validation and generate examples
    ↓
Visualize relationships and dependencies
    ↓
Export or share findings
```

### 4.3 Folder Structure
```
app/
├── (explorer)/
│   └── page.tsx                 # Main template & schema explorer
├── components/
│   ├── explorer/
│   │   ├── TemplateExplorer.tsx
│   │   ├── SchemaViewer.tsx
│   │   ├── ValidationPanel.tsx
│   │   ├── RelationshipGraph.tsx
│   │   └── ExampleDataPanel.tsx
├── hooks/
│   ├── useAtomicData.ts
│   └── useTemplateValidation.ts
├── lib/
│   ├── atomic/
│   │   ├── template-fetcher.ts
│   │   └── schema-validator.ts
│   └── utils.ts
├── types/
│   └── atomic-explorer.ts
public/
└── mock-data/                   # Sample templates and schemas for demo
```

### 4.4 Security & Privacy Notes
- All data is fetched from public Atomic APIs
- Validation runs entirely client-side
- No sensitive data is stored or transmitted unnecessarily

---

## 5. Implementation Examples & Code Snippets

### 1. Fetching templates
```ts
// hooks/useAtomicData.ts
export function useTemplates(collectionName?: string) {
  return useQuery({
    queryKey: ['atomic-templates', collectionName],
    queryFn: async () => {
      return fetchAtomicTemplates(collectionName);
    },
  });
}
```

### 2. Schema validation
```ts
// lib/atomic/schema-validator.ts
export function validateSchema(schema, data) {
  // Perform validation against Atomic schema rules
  return { valid, errors };
}
```

---

## 6. Demo & Testing Strategy

- **Live Demo Toggle:** Mock data ↔ Live Atomic data
- **Storybook** for explorer, validation, graphs
- **Playwright** e2e: search → view template → validate schema
- **Vitest** for validation logic
- Vercel previews

---

## 7. Roadmap & Development Phases

**Phase 0 — Scaffold (1–2 days)**
- Next.js + Tailwind + basic explorer and data fetching

**Phase 1 — Core Logic (5 days)**
- Template/schema fetching, validation engine, relationship mapping

**Phase 2 — Core UI (4 days)**
- Explorer interface, schema viewer, validation panel, relationship graph

**Phase 3 — Polish (2 days)**
- Performance, a11y, responsive design, beautiful visualizations

**Phase 4 — Documentation & Release (2 days)**
- Full README, screenshots, AI prompt pack, make public

**Future Enhancements**
- Advanced filtering and saved searches
- Bulk validation and reporting
- Integration with blend and drop tools
- Community-contributed template examples and best practices

---

## 8. Visual References & Mockups

**Key Screen:**
Clean explorer interface with powerful search and filters. Main panel shows detailed template or schema view with tabs for structure, validation, examples, and relationships. Clear validation status and beautiful visualizations. Professional developer-focused aesthetic.

> *Feels like a premium database schema explorer meets calm Web3 tooling — powerful, clear, and delightful to use.*

**ASCII Sketch:**
```
[ Search Templates & Schemas ]

Template: Cosmic Dragon #42
Schema: attributes.name (string)
           attributes.power (number)

[ Validate ] [ View Relationships ] [ Generate Example ]
```

---

## 9. Related Blueprints & Ecosystem Fit

- Direct companion to other Atomic ecosystem blueprints (markets, blends, drops).
- Supports all developers working with AtomicAssets.
- Excellent reference material for PX Learn.

---

## 10. License, Contributing & Credits

- MIT License
- Built with ❤️ for better AtomicAssets developer experience on WAX
- Uses public AtomicAssets APIs and Pixel Journey Design System
- Special thanks to the focus on core WAX Atomic tooling

**This blueprint makes working with Atomic templates and schemas intuitive and efficient.**

*Pixel Journey — Beautiful interfaces for public blockchain data.*

---

*Last updated: July 02, 2026*