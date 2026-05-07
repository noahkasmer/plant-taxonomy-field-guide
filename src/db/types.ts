import * as SQLite from 'expo-sqlite';

export type DatabaseHandle = Awaited<ReturnType<typeof SQLite.openDatabaseAsync>> & {
  closeAsync: () => Promise<void>;
  withExclusiveTransactionAsync: (
    task: (txn: DatabaseHandle) => Promise<void>,
  ) => Promise<void>;
  databasePath?: string;
};

export type SQLiteModuleWithDelete = typeof SQLite & {
  deleteDatabaseAsync: (databaseName: string, directory?: string) => Promise<void>;
};
