declare module 'expo-sqlite' {
  export type SQLiteDatabase = {
    execAsync(sql: string): Promise<void>;
    runAsync(sql: string, params?: unknown[] | Record<string, unknown>): Promise<unknown>;
    getFirstAsync<T>(sql: string, params?: unknown[] | Record<string, unknown>): Promise<T | null>;
    getAllAsync<T>(sql: string, params?: unknown[] | Record<string, unknown>): Promise<T[]>;
  };

  export function openDatabaseAsync(databaseName: string): Promise<SQLiteDatabase>;
}
