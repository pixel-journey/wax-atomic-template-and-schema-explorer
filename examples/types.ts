/**
 * Shared types for Atomic template & schema exploration.
 * Shapes are educational approximations of AtomicAssets concepts.
 */

export interface SchemaAttribute {
  name: string;
  /** Atomic schema format string, e.g. "string", "uint64", "image" */
  format: string;
}

export interface AtomicSchema {
  collectionName: string;
  schemaName: string;
  format: SchemaAttribute[];
}

export interface AtomicTemplate {
  templateId: string | number;
  collectionName: string;
  schemaName: string;
  maxSupply: number | string;
  isTransferable?: boolean;
  isBurnable?: boolean;
  immutableData: Record<string, unknown>;
  mutableData?: Record<string, unknown>;
}

export interface FieldValidationResult {
  field: string;
  ok: boolean;
  message?: string;
}

export interface SchemaValidationResult {
  ok: boolean;
  fields: FieldValidationResult[];
}
