import db from "../db/db";
import {
  createSubFolderInputTypes,
  updateSubFolderInputTypes,
  subFolderQueryInputTypes,
} from "../schemas/sub-folder";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: subFolderQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.sub_folder.findMany({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        title: queries.sort,
      },
    }),
    db.sub_folder.count({
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
  queries: subFolderQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.sub_folder.findMany({
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
        title: queries.sort,
      },
    }),
    db.sub_folder.count({
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
  const data = await db.sub_folder.findUnique({
    where: { id },
  });

  return data;
};

const getSingleWithTeamInfo = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.sub_folder.findUnique({
    where: { id },
    include: {
      folder: {
        include: {
          category: {
            include: {
              team: true,
            },
          },
        },
      },
    },
  });

  return data;
};

const createNew = async (info: createSubFolderInputTypes) => {
  const data = await db.sub_folder.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateSubFolderInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.sub_folder.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.sub_folder.delete({
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
  getMultiByTeamId,
};
