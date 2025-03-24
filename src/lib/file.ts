import db from "../db/db";
import {
  createFileInputTypes,
  updateFileInputTypes,
  fileQueryInputTypes,
} from "../schemas/file";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: fileQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.file.findMany({
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
    db.file.count({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
      },
    }),
  ]);

  return { data, count };
};

const getMultiByTeamId = async (
  teamId: string,
  queries: fileQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.file.findMany({
      where: {
        folder: {
          category: {
            team_id: teamId || "",
          },
        },
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
    db.file.count({
      where: {
        folder: {
          category: {
            team_id: teamId || "",
          },
        },
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
  const data = await db.file.findUnique({
    where: { id },
    include: {
      folder: {
        include: {
          category: true
        }
      }
    }
  });

  return data;
};

const createNew = async (info: createFileInputTypes) => {
  const data = await db.file.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateFileInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.file.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.file.delete({
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
  getMultiByTeamId
};
