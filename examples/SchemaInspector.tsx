"use client";

import { useId } from "react";
import { describeFormat, isKnownFormat } from "./schemaFormats";
import type { AtomicSchema } from "./types";

export interface SchemaInspectorProps {
  schema: AtomicSchema;
  className?: string;
}

/**
 * SchemaInspector — lists schema attributes with format descriptions.
 */
export function SchemaInspector({ schema, className = "" }: SchemaInspectorProps) {
  const headingId = useId();

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-black/20 p-6 ${className}`}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="font-semibold text-lg mb-1">
        Schema: {schema.schemaName}
      </h3>
      <p className="text-sm text-white/60 mb-5">
        Collection <span className="font-mono text-white/80">{schema.collectionName}</span>
        {" · "}
        {schema.format.length} attribute{schema.format.length === 1 ? "" : "s"}
      </p>

      {schema.format.length === 0 ? (
        <p className="text-sm text-white/50" role="status">
          This schema has no attributes in the provided definition.
        </p>
      ) : (
        <ul className="space-y-3" aria-label="Schema attributes">
          {schema.format.map((attr) => {
            const known = isKnownFormat(attr.format);
            return (
              <li
                key={attr.name}
                className="flex flex-col gap-0.5 border-b border-white/5 pb-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="font-mono text-sm text-white/90">{attr.name}</span>
                <span className="text-sm text-white/60">
                  <span className={known ? "text-emerald-400/90" : "text-amber-300/90"}>
                    {attr.format}
                  </span>
                  <span className="text-white/40"> — {describeFormat(attr.format)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
