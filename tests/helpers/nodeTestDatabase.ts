import { DatabaseSync } from 'node:sqlite';

type QueryParams = unknown[] | Record<string, unknown> | unknown;

function normalizeParams(params: unknown[]) {
  if (params.length === 0) {
    return [];
  }

  if (params.length === 1) {
    const [first] = params;
    if (Array.isArray(first)) {
      return first;
    }

    if (first && typeof first === 'object') {
      return [first];
    }
  }

  return params;
}

export class NodeTestDatabase {
  readonly databasePath: string;
  private readonly database: DatabaseSync;

  constructor(databasePath = ':memory:') {
    this.databasePath = databasePath;
    this.database = new DatabaseSync(databasePath);
    this.database.exec('PRAGMA foreign_keys = ON;');
  }

  async execAsync(source: string) {
    this.database.exec(source);
  }

  async runAsync(source: string, ...params: unknown[]) {
    const statement = this.database.prepare(source);
    const normalized = normalizeParams(params);
    const result = statement.run(...normalized);

    return {
      changes: result.changes,
      lastInsertRowId: Number(result.lastInsertRowid ?? 0),
    };
  }

  async getAllAsync<T>(source: string, ...params: unknown[]) {
    const statement = this.database.prepare(source);
    const normalized = normalizeParams(params);
    return statement.all(...normalized) as T[];
  }

  async getFirstAsync<T>(source: string, ...params: unknown[]) {
    const statement = this.database.prepare(source);
    const normalized = normalizeParams(params);
    return (statement.get(...normalized) as T | undefined) ?? null;
  }

  async withExclusiveTransactionAsync(task: (txn: NodeTestDatabase) => Promise<void>) {
    this.database.exec('BEGIN IMMEDIATE');

    try {
      await task(this);
      this.database.exec('COMMIT');
    } catch (error) {
      this.database.exec('ROLLBACK');
      throw error;
    }
  }

  async closeAsync() {
    this.database.close();
  }
}
