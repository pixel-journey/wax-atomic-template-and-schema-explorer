"use client";

import { useId, useMemo } from "react";
import { validateAgainstSchema } from "./schemaFormats";
import type { AtomicSchema } from "./types";

export interface ValidationPanelProps {
  schema: AtomicSchema;
  data: Record<string, unknown>;
  className?: string;
}

/**
 * ValidationPanel — runs pure schema validation and lists per-field results.
 */
export function ValidationPanel({
  schema,
  data,
  className = "",
}: ValidationPanelProps) {
  const headingId = useId();
  const result = useMemo(
    () => validateAgainstSchema(schema, data),
    [schema, data]
  );

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-black/20 p-6 ${className}`}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="font-semibold text-lg mb-1">
        Payload Validation
      </h3>
      <p className="text-sm text-white/60 mb-4">
        Client-side pre-flight checks against schema{" "}
        <span className="font-mono text-white/80">{schema.schemaName}</span>. Not a
        substitute for chain rules.
      </p>

      <p
        className={`mb-4 text-sm font-medium ${
          result.ok ? "text-emerald-400" : "text-amber-300"
        }`}
        role="status"
        aria-live="polite"
      >
        {result.ok ? "All checked fields look valid" : "Issues found — review below"}
      </p>

      <ul className="space-y-2 text-sm">
        {result.fields.map((f) => (
          <li
            key={f.field}
            className="flex flex-col gap-0.5 sm:flex-row sm:justify-between"
          >
            <span className="font-mono text-white/80">{f.field}</span>
            <span className={f.ok ? "text-emerald-400/90" : "text-amber-200"}>
              {f.ok ? "OK" : f.message ?? "Invalid"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
