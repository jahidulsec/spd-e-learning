import db from "../db/db";
import {
  createFolderInputTypes,
  updateFolderInputTypes,
  folderQueryInputTypes,
} from "../schemas/folder";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: folderQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.folder.findMany({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        created_at: queries.sort,
      },
    }),
    db.folder.count({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
      },
    }),
  ]);

  return { data, count };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.folder.findUnique({
    where: { id },
  });

  return data;
};

const getSingleWithTeamInfo = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.folder.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          team: true,
        },
      },
    },
  });

  return data;
};

const createNew = async (info: createFolderInputTypes) => {
  const data = await db.folder.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateFolderInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.folder.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.folder.delete({
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
  getSingleWithTeamInfo,
};
