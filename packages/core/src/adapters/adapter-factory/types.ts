export type Where = {
  field: string;
  operator?:
    | "eq"
    | "ne"
    | "lt"
    | "lte"
    | "gt"
    | "gte"
    | "in"
    | "not_in"
    | "contains";
  value: any;
  connector?: "AND" | "OR";
};

export type QueryOptions = {
  limit?: number;
  offset?: number;
  sortBy?: { field: string; direction: "asc" | "desc" };
};

export type AdapterFactoryOptions = {
  provider?:
    | "sqlite"
    | "cockroachdb"
    | "mysql"
    | "postgresql"
    | "sqlserver"
    | "mongodb";

  usePlural: boolean | undefined;
  transactions?: boolean | undefined;
  debugLogs?: boolean;
};

export interface DBAdapter {
  create<T>(model: string, data: T, select?: string[]): Promise<T>;
  findOne<T>(
    model: string,
    where: Where[],
    select?: string[]
  ): Promise<T | null>;
  findMany<T>(
    model: string,
    where?: Where[],
    options?: QueryOptions
  ): Promise<T[]>;
  update<T>(
    model: string,
    where: Where[],
    update: Partial<T>
  ): Promise<T | null>;
  updateMany<T>(
    model: string,
    where: Where[],
    update: Partial<T>
  ): Promise<number>;
  delete(model: string, where: Where[]): Promise<void>;
  deleteMany(model: string, where: Where[]): Promise<number>;
  count(model: string, where?: Where[]): Promise<number>;
  transaction?<R>(callback: (trx: DBAdapter) => Promise<R>): Promise<R>;
  options?: AdapterFactoryOptions;
}

