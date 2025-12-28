import {
  ObjectId,
  type ClientSession,
  type Db,
  type Document,
  type MongoClient,
} from "@keylio/db/mongodb";
import type {
  DBAdapter,
  QueryOptions,
  Where,
} from "../adapter-factory/types.js";

export interface MongoDbAdapterConfig {
  client?: MongoClient | undefined;
  usePlural: boolean | undefined;
  transactions?: boolean | undefined;
  advanced?: {
    generateId(): string;
  };
}

export const mongoAdapter = (
  db: Db,
  options: MongoDbAdapterConfig,
  session?: ClientSession | undefined
): DBAdapter => {
  const getCustomIdGenerator = () => {
    const generator = options.advanced?.generateId;

    if (typeof generator === "function") {
      return generator;
    }

    return undefined;
  };
  const customGenId = getCustomIdGenerator();
  const serializeId = ({ field, value }: { field: string; value: any }) => {
    if (customGenId) {
      return value;
    }

    if (field === "id" || field === "_id") {
      if (value === null || value === undefined) {
        return value;
      }

      if (typeof value !== "string") {
        if (value instanceof ObjectId) {
          return value;
        }

        if (Array.isArray(value)) {
          return value.map((val) => {
            if (val === null || val === undefined) {
              return val;
            }

            if (typeof val === "string") {
              try {
                return new ObjectId(val);
              } catch (error) {
                return val;
              }
            }

            if (val instanceof ObjectId) {
              return val;
            }
            throw new Error("Invalid ID value");
          });
        }
        throw new Error("Invalid ID value");
      }
      try {
        return new ObjectId(value);
      } catch (error) {
        return value;
      }
    }

    return value;
  };
  const convertWhereClause = (where: Where[] | undefined) => {
    if (!where?.length) return {};

    const conditions = where.map((w) => {
      const { field: field_, value, connector = "AND", operator = "eq" } = w;
      let field = field_;
      let condition: any;
      if (field === "id") field = "_id";

      switch (operator.toLowerCase()) {
        case "eq":
          condition = {
            [field]: serializeId({
              field,
              value,
            }),
          };
          break;
        case "in":
          condition = {
            [field]: {
              $in: Array.isArray(value)
                ? value.map((v) =>
                    serializeId({
                      field,
                      value: v,
                    })
                  )
                : [serializeId({ field, value })],
            },
          };
          break;
        case "not_in":
          condition = {
            [field]: {
              $nin: Array.isArray(value)
                ? value.map((v) =>
                    serializeId({
                      field,
                      value: v,
                    })
                  )
                : [serializeId({ field, value })],
            },
          };
          break;
        case "gt":
          condition = {
            [field]: {
              $gt: serializeId({
                field,
                value,
              }),
            },
          };
          break;
        case "gte":
          condition = {
            [field]: {
              $gte: serializeId({
                field,
                value,
              }),
            },
          };
          break;
        case "lt":
          condition = {
            [field]: {
              $lt: serializeId({
                field,
                value,
              }),
            },
          };
          break;
        case "lte":
          condition = {
            [field]: {
              $lte: serializeId({
                field,
                value,
              }),
            },
          };
          break;
        case "ne":
          condition = {
            [field]: {
              $ne: serializeId({
                field,
                value,
              }),
            },
          };
          break;
        case "contains":
          condition = {
            [field]: {
              $regex: `.*${escapeForMongoRegex(value as string)}.*`,
            },
          };
          break;
        case "starts_with":
          condition = {
            [field]: { $regex: `^${escapeForMongoRegex(value as string)}` },
          };
          break;
        case "ends_with":
          condition = {
            [field]: { $regex: `${escapeForMongoRegex(value as string)}$` },
          };
          break;
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
      return { condition, connector };
    });
    if (conditions.length === 1) {
      return conditions[0]!.condition;
    }
    const andConditions = conditions
      .filter((c) => c.connector === "AND")
      .map((c) => c.condition);
    const orConditions = conditions
      .filter((c) => c.connector === "OR")
      .map((c) => c.condition);

    let clause = {};
    if (andConditions.length) {
      clause = { ...clause, $and: andConditions };
    }
    if (orConditions.length) {
      clause = { ...clause, $or: orConditions };
    }
    return clause;
  };

  return {
    async create<T>(model: string, data: T, select?: string[]): Promise<T> {
      const res = await db
        .collection(model)
        .insertOne(data as Document, { session });
      const insertedData = {
        _id: res.insertedId.toString(),
        ...data,
      };
      return insertedData as T;
    },

    async findOne<T>(
      model: string,
      where: Where[],
      select?: string[]
    ): Promise<T | null> {
      const clause = convertWhereClause(where);
      const projection = select
        ? Object.fromEntries(select.map((field) => [field, 1]))
        : {};
      const res = await db
        .collection(model)
        .findOne(clause, { session, projection });
      if (!res) return null;
      return res as T;
    },

    async findMany<T>(
      model: string,
      where?: Where[],
      options?: QueryOptions
    ): Promise<T[]> {
      const { limit, offset, sortBy } = options || {};
      const clause = where ? convertWhereClause(where) : {};
      const cursor = db.collection(model).find(clause, { session });
      if (limit) cursor.limit(limit);
      if (offset) cursor.skip(offset);
      if (sortBy)
        cursor.sort(sortBy.field, sortBy.direction === "desc" ? -1 : 1);
      const res = await cursor.toArray();
      return res as T[];
    },

    async count(model, where) {
      const clause = where ? convertWhereClause(where) : {};
      const res = await db
        .collection(model)
        .countDocuments(clause, { session });
      return res;
    },

    async update<T>(
      model: string,
      where: Where[],
      update: Partial<T>
    ): Promise<T | null> {
      const clause = convertWhereClause(where);
      const res = await db.collection(model).findOneAndUpdate(
        clause,
        {
          $set: update,
        },
        {
          session,
          returnDocument: "after",
        }
      );

      if (!res) return null;
      return res as T;
    },
    async updateMany<T>(
      model: string,
      where: Where[],
      update: Partial<T>
    ): Promise<number> {
      const clause = convertWhereClause(where);

      const res = await db.collection(model).updateMany(
        clause,
        {
          $set: update,
        },
        { session }
      );
      return res.modifiedCount;
    },

    async delete(model, where) {
      const clause = convertWhereClause(where);
      await db.collection(model).deleteOne(clause, { session });
    },

    async deleteMany(model, where) {
      const clause = convertWhereClause(where);
      const res = await db.collection(model).deleteMany(clause, {
        session,
      });

      return res.deletedCount;
    },
  };
};

function escapeForMongoRegex(input: string, maxLength = 256): string {
  if (typeof input !== "string") return "";

  // Escape all PCRE special characters
  // Source: PCRE docs — https://www.pcre.org/original/doc/html/pcrepattern.html
  return input.slice(0, maxLength).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
