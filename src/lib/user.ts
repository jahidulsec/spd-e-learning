import db from "@/db/db";
import { requiredIdTypes } from "@/schemas/required-id";
import {
  createUserInputsTypes,
  updateUserInputTypes,
  usersQueryInputTypes,
} from "@/schemas/user";

const getMulti = async (queries: usersQueryInputTypes) => {
  const size = queries?.size ?? 20;
  const page = queries?.page ?? 1;
  const sort = queries?.sort ?? "desc";

  const [data, count] = await Promise.all([
    db.users.findMany({
      where: {
        full_name: {
          startsWith: queries.search || undefined,
        },
        mobile: {
          startsWith: queries.search || undefined,
        },
      },
      take: size,
      skip: size * (page - 1),
      orderBy: {
        created_at: sort,
      },
    }),
    db.users.count({
      where: {
        full_name: {
          startsWith: queries.search || undefined,
        },
        mobile: {
          startsWith: queries.search || undefined,
        },
      },
    }),
  ]);

  return { data, count, page, size };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.users.findUnique({
    where: { sap_id: id },
  });

  return data;
};

const createNew = async (info: createUserInputsTypes) => {
  const data = await db.users.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateUserInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.users.update({
    where: { sap_id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.users.delete({
    where: { sap_id: id },
  });

  return deleted;
};

export = {
  getMulti,
  getSingle,
  createNew,
  updateOne,
  deleteOne,
};
