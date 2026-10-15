"use client";

import { SchemaInspector } from "./SchemaInspector";
import { TemplateCard } from "./TemplateCard";
import { ValidationPanel } from "./ValidationPanel";
import type { AtomicSchema, AtomicTemplate } from "./types";

const DEMO_SCHEMA: AtomicSchema = {
  collectionName: "demo.collection",
  schemaName: "card",
  format: [
    { name: "name", format: "string" },
    { name: "img", format: "image" },
    { name: "power", format: "uint16" },
    { name: "foil", format: "bool" },
  ],
};

const DEMO_TEMPLATE: AtomicTemplate = {
  templateId: 42,
  collectionName: "demo.collection",
  schemaName: "card",
  maxSupply: 1000,
  isTransferable: true,
  isBurnable: true,
  immutableData: {
    name: "Pixel Scout",
    img: "https://example.com/scout.png",
    power: 10,
  },
  mutableData: {
    foil: false,
  },
};

const SAMPLE_PAYLOAD = {
  name: "Pixel Scout",
  img: "https://example.com/scout.png",
  power: 10,
  foil: false,
};

/**
 * Educational composition of schema + template + validation views.
 */
export default function AtomicTemplateSchemaDemo() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-400/80">
          Pixel Journey · Atomic Ecosystem
        </p>
        <h1 className="text-2xl font-bold text-white">
          Template & Schema Explorer Demo
        </h1>
        <p className="text-sm text-white/60 max-w-2xl">
          Fixture data only. Use pure validators before minting; live chain data
          comes from AtomicAssets APIs in a full integration.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <SchemaInspector schema={DEMO_SCHEMA} />
        <TemplateCard template={DEMO_TEMPLATE} />
      </div>

      <ValidationPanel schema={DEMO_SCHEMA} data={SAMPLE_PAYLOAD} />
    </div>
  );
}
