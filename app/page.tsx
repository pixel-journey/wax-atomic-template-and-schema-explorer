'use client';

import React, { useCallback, useState } from 'react';
import { describeFormat, isKnownFormat } from '../examples/schemaFormats';
import {
  fetchCollectionSchemas,
  fetchCollectionTemplates,
} from '../examples/live/atomicassets';
import type { AtomicSchema, AtomicTemplate } from '../examples/types';

export default function AtomicTemplateSchemaExplorer() {
  const [collection, setCollection] = useState('pixeljourney');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemas, setSchemas] = useState<AtomicSchema[]>([]);
  const [templates, setTemplates] = useState<AtomicTemplate[]>([]);
  const [meta, setMeta] = useState<string | null>(null);

  const runLive = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMeta(null);
    try {
      const [s, t] = await Promise.all([
        fetchCollectionSchemas(collection, { limit: 30 }),
        fetchCollectionTemplates(collection, { limit: 24 }),
      ]);
      setSchemas(s.schemas);
      setTemplates(t.templates);
      setMeta(
        `${s.schemas.length} schemas · ${t.templates.length} templates · ${s.source}`
      );
      if (s.schemas.length === 0 && t.templates.length === 0) {
        setError('No schemas or templates returned for this collection.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Live fetch failed');
      setSchemas([]);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [collection]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-2xl tracking-widest text-emerald-400 mb-2 font-bold">
          ATOMIC TEMPLATE & SCHEMA EXPLORER
        </div>
        <div className="text-xs opacity-60 mb-6">
          Pixel Journey · Live AtomicAssets (AtomicHub indexer path) · Read-only
        </div>

        <div className="border border-white/10 bg-black/40 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row gap-3">
          <input
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm"
            placeholder="collection_name"
          />
          <button
            type="button"
            onClick={runLive}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-sky-600 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Fetching…' : 'Load live'}
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-400 border border-red-500/30 rounded-xl p-3">
            {error}
          </div>
        )}
        {meta && (
          <div className="mb-4 text-xs opacity-50 break-all">{meta}</div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <section className="border border-white/10 bg-black/40 rounded-2xl p-4">
            <h2 className="text-sm uppercase tracking-wider text-white/50 mb-3">
              Schemas ({schemas.length})
            </h2>
            <ul className="space-y-4 max-h-[28rem] overflow-y-auto text-sm">
              {schemas.map((s) => (
                <li key={s.schemaName} className="border-b border-white/10 pb-3">
                  <div className="font-mono text-emerald-400">{s.schemaName}</div>
                  <ul className="mt-2 space-y-1 text-xs opacity-80">
                    {s.format.map((f) => (
                      <li key={f.name}>
                        <span className="font-mono">{f.name}</span>:{' '}
                        <span
                          className={
                            isKnownFormat(f.format)
                              ? 'text-sky-300'
                              : 'text-amber-300'
                          }
                        >
                          {f.format}
                        </span>{' '}
                        <span className="opacity-50">
                          ({describeFormat(f.format)})
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {schemas.length === 0 && (
                <li className="opacity-50">No schemas loaded.</li>
              )}
            </ul>
          </section>

          <section className="border border-white/10 bg-black/40 rounded-2xl p-4">
            <h2 className="text-sm uppercase tracking-wider text-white/50 mb-3">
              Templates ({templates.length})
            </h2>
            <ul className="space-y-3 max-h-[28rem] overflow-y-auto text-sm">
              {templates.map((t) => (
                <li
                  key={String(t.templateId)}
                  className="border-b border-white/10 pb-2"
                >
                  <div className="font-mono">
                    #{t.templateId}{' '}
                    <span className="opacity-60">→ {t.schemaName}</span>
                  </div>
                  <div className="text-xs opacity-60">
                    max {String(t.maxSupply)} · transferable{" "}
                    {String(t.isTransferable)} · burnable {String(t.isBurnable)}
                  </div>
                  <div className="text-xs opacity-50 mt-1 truncate">
                    immutable keys:{" "}
                    {Object.keys(t.immutableData).join(', ') || '(none)'}
                  </div>
                </li>
              ))}
              {templates.length === 0 && (
                <li className="opacity-50">No templates loaded.</li>
              )}
            </ul>
          </section>
        </div>

        <p className="mt-8 text-xs opacity-60">
          Data path matches AtomicHub: public AtomicAssets API. Pure validators in{' '}
          <code className="text-emerald-400/80">schemaFormats.ts</code> stay offline.
        </p>
      </div>
    </div>
  );
}
