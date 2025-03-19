import db from "../db/db";
import {
  categoryQueryInputTypes,
  createCategoryInputTypes,
  updateCategoryInputTypes,
} from "../schemas/category";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: categoryQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.category.findMany({
      where: {
        title: {
          startsWith: queries.search || undefined,
          mode: "insensitive",
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        created_at: queries.sort,
      },
    }),
    db.category.count({
      where: {
        title: {
          startsWith: queries.search || undefined,
          mode: "insensitive",
        },
      },
    }),
  ]);

  return { data, count };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.category.findUnique({
    where: { id },
  });

  return data;
};

const createNew = async (info: createCategoryInputTypes) => {
  const data = await db.category.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateCategoryInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.category.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.category.delete({
    where: { id: id },
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
