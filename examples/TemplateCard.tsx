"use client";

import { useId } from "react";
import type { AtomicTemplate } from "./types";

export interface TemplateCardProps {
  template: AtomicTemplate;
  className?: string;
}

function DataBlock({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown>;
}) {
  const entries = Object.entries(data);
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-wide text-white/40 mb-2">
        {title}
      </h4>
      {entries.length === 0 ? (
        <p className="text-sm text-white/40">None</p>
      ) : (
        <dl className="space-y-1 text-sm">
          {entries.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="font-mono text-white/60">{k}</dt>
              <dd className="font-mono text-white/90 truncate max-w-[60%] text-right">
                {typeof v === "object" ? JSON.stringify(v) : String(v)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/**
 * TemplateCard — inspect template metadata and immutable/mutable data separately.
 */
export function TemplateCard({ template, className = "" }: TemplateCardProps) {
  const headingId = useId();

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-black/20 p-6 ${className}`}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="font-semibold text-lg mb-1">
        Template #{template.templateId}
      </h3>
      <p className="text-sm text-white/60 mb-4">
        <span className="font-mono text-white/80">{template.collectionName}</span>
        {" / "}
        <span className="font-mono text-white/80">{template.schemaName}</span>
      </p>

      <dl className="grid grid-cols-2 gap-2 text-sm mb-5">
        <div>
          <dt className="text-white/50">Max supply</dt>
          <dd className="font-mono text-white/90">{String(template.maxSupply)}</dd>
        </div>
        <div>
          <dt className="text-white/50">Transferable</dt>
          <dd className="text-white/90">
            {template.isTransferable === undefined
              ? "—"
              : template.isTransferable
                ? "Yes"
                : "No"}
          </dd>
        </div>
        <div>
          <dt className="text-white/50">Burnable</dt>
          <dd className="text-white/90">
            {template.isBurnable === undefined
              ? "—"
              : template.isBurnable
                ? "Yes"
                : "No"}
          </dd>
        </div>
      </dl>

      <div className="space-y-4">
        <DataBlock title="Immutable data" data={template.immutableData} />
        <DataBlock
          title="Mutable data"
          data={template.mutableData ?? {}}
        />
      </div>
    </section>
  );
}
