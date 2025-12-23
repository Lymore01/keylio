import {
  AdapterFactoryOptions,
  DBAdapter,
  Where,
} from "../adapter-factory/types.js";
import { AuthError } from "../errors.js";

type PrismaClient = {};

type PrismaClientInternal = {
  $transaction: (
    callback: (db: PrismaClient) => Promise<any> | any
  ) => Promise<any>;
} & {
  [model: string]: {
    create: (data: any) => Promise<any>;
    findFirst: (data: any) => Promise<any>;
    findMany: (data: any) => Promise<any>;
    update: (data: any) => Promise<any>;
    updateMany: (data: any) => Promise<any>;
    delete: (data: any) => Promise<any>;
    [key: string]: any;
  };
};

export const convertWhereClause = (where: Where[] | undefined) => {
  const and = where?.filter((w) => w.connector !== "OR");
  const or = where?.filter((w) => w.connector === "OR");

  if (!where || !where.length) return {};

  const build = (w: Where) => {
    const op = w.operator || "eq";
    const field = w.field;
    return {
      [field]: op === "eq" ? w.value : { [mapOperator(op)]: w.value },
    };
  };

  return {
    ...(and?.length ? { AND: and.map(build) } : {}),
    ...(or?.length ? { OR: or.map(build) } : {}),
  };
};

const mapOperator = (op: string) => {
  return (
    {
      ne: "not",
      in: "in",
      not_in: "notIn",
      starts_with: "startsWith",
      ends_with: "endsWith",
    }[op] || op
  );
};

/**
 * Gets the Prisma delegate for a given model name.
 *
 * @param db
 * @param model
 * @returns the delegate for the given model, or undefined if not found
 */

function getDelegate(db: any, model: string) {
  if (db[model]) return db[model];
  const lower = model.toLowerCase();
  if (db[lower]) return db[lower];
  const camel = model.charAt(0).toLowerCase() + model.slice(1);
  if (db[camel]) return db[camel];
  return undefined;
}

/**
 * Creates a Keylio database adapter using Prisma.
 *
 * @param prisma - Prisma client instance
 * @returns A Keylio-compatible DBAdapter
 */

export const prismaAdapter = (
  prisma: PrismaClient,
  config?: AdapterFactoryOptions
): DBAdapter => {
  const db = prisma as PrismaClientInternal;

  // Todo: Add getFieldName method
  const convertSelect = (select: string[] | undefined) => {
    if (!select) return undefined;

    return select.reduce((prev, current) => {
      return {
        ...prev,
        [current]: true,
      };
    }, {});
  };

  return {
    async create(model, data, select) {
      const delegate = getDelegate(db, model);
      if (!delegate) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      return await delegate.create({
        data,
        select: convertSelect(select),
      });
    },
    async findOne(model, where, select) {
      const whereClause = convertWhereClause(where);
      const delegate = getDelegate(db, model);
      if (!delegate) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }
      return await delegate.findFirst({
        where: whereClause,
        select: convertSelect(select),
      });
    },
    async findMany(model, where, options) {
      const whereClause = convertWhereClause(where);
      const delegate = getDelegate(db, model);
      if (!delegate) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      return (await delegate.findMany({
        where: whereClause,
        take: options?.limit || 100,
        skip: options?.offset || 0,
        ...(options?.sortBy?.field
          ? {
              orderBy: {
                [options?.sortBy.field]: options?.sortBy.direction,
              },
            }
          : {}),
      })) as any[];
    },
    async update(model, where, update) {
      const whereClause = convertWhereClause(where);
      const delegate = getDelegate(db, model);
      if (!delegate) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      // Prisma update requires a unique where clause.
      // We try to find the record first to get its ID.
      const record = await delegate.findFirst({ where: whereClause });
      if (!record) return null;

      if (record.id) {
        return await delegate.update({
          where: { id: record.id },
          data: update,
        });
      }

      return await delegate.update({
        where: whereClause,
        data: update,
      });
    },

    async updateMany(model, where, update) {
      const whereClause = convertWhereClause(where);
      const delegate = getDelegate(db, model);
      if (!delegate)
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} not found`,
        });
      const result = await delegate.updateMany({
        where: whereClause,
        data: update,
      });
      return result ? (result.count as number) : 0;
    },

    async delete(model, where) {
      const whereClause = convertWhereClause(where);
      const delegate = getDelegate(db, model);
      if (!delegate) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      try {
        const record = await delegate.findFirst({ where: whereClause });
        if (record && record.id) {
          await delegate.delete({
            where: { id: record.id },
          });
        } else if (record) {
          await delegate.delete({ where: whereClause });
        }
      } catch (error: any) {
        if (error?.meta?.cause === "Record to delete does not exist.") return;
        console.log(error);
      }
    },

    async deleteMany(model, where) {
      const whereClause = convertWhereClause(where);
      const delegate = getDelegate(db, model);
      if (!delegate)
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} not found`,
        });
      const result = await delegate.deleteMany({
        where: whereClause,
      });
      return result ? (result.count as number) : 0;
    },
    async count(model, where) {
      const whereClause = convertWhereClause(where);
      const delegate = getDelegate(db, model);
      if (!delegate) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      return await delegate.count({
        where: whereClause,
      });
    },
    async transaction(callback) {
      return await db.$transaction(async (tx) => {
        return await callback(prismaAdapter(tx as PrismaClient, config));
      });
    },
    options: config,
  };
};
