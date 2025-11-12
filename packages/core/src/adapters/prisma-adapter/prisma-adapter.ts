import { AuthError } from "../../errors";
import type { AdapterFactoryOptions, DBAdapter, Where } from "../index";

interface PrismaClient {}

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

export const prismaAdapter = (
  prisma: PrismaClient,
  config: AdapterFactoryOptions
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

  const convertWhereClause = (where: Where[] | undefined) => {
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
  return {
    async create(model, data, select) {
      if (!db[model]) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      return await db[model]!.create({
        data,
        select: convertSelect(select),
      });
    },
    async findOne(model, where, select) {
      const whereClause = convertWhereClause(where);
      if (!db[model]) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }
      return await db[model]!.findFirst({
        where: whereClause,
        select: convertSelect(select),
      });
    },
    async findMany(model, where, options) {
      const whereClause = convertWhereClause(where);
      if (!db[model]) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      return (await db[model]!.findMany({
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
      if (!db[model]) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      return await db[model]!.update({
        where: whereClause,
        data: update,
      });
    },

    async updateMany(model, where, update) {
      const whereClause = convertWhereClause(where);
      const result = await db[model]!.updateMany({
        where: whereClause,
        data: update,
      });
      return result ? (result.count as number) : 0;
    },

    async delete(model, where) {
      const whereClause = convertWhereClause(where);
      if (!db[model]) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      try {
        await db[model]!.delete({
          where: whereClause,
        });
      } catch (error: any) {
        if (error?.meta?.cause === "Record to delete does not exist.") return;
        console.log(error);
      }
    },

    async deleteMany(model, where) {
      const whereClause = convertWhereClause(where);
      const result = await db[model]!.deleteMany({
        where: whereClause,
      });
      return result ? (result.count as number) : 0;
    },
    async count(model, where) {
      const whereClause = convertWhereClause(where);
      if (!db[model]) {
        throw new AuthError({
          code: "MODEL_NOT_FOUND",
          message: `Model ${model} does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'`,
        });
      }

      return await db[model]!.count({
        where: whereClause,
      });
    },
    options: config,
  };
};
