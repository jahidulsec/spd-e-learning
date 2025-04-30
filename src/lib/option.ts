import db from "../db/db";
import {
  optionQueryInputTypes,
  createOptionInputTypes,
  updateOptionInputTypes,
} from "../schemas/option";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: optionQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.quiz_option.findMany({
      where: {
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search || undefined,
              },
            },
            {
              question_id: {
                startsWith: queries.search || undefined,
              },
            },
          ],
        }),
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
      },
    }),
    db.quiz_option.count({
      where: {
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search || undefined,
              },
            },
            {
              question_id: {
                startsWith: queries.search || undefined,
              },
            },
          ],
        }),
      },
    }),
  ]);

  return { data, count };
};

const getMultiByTeamId = async (
  teamId: string,
  queries: optionQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.quiz_option.findMany({
      where: {
        question: {
          quiz: {
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
        [queries.sort_type]: queries.sort,
      },
    }),
    db.quiz_option.count({
      where: {
        question: {
          quiz: {
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

const getSingleWithTeamInfo = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.quiz_option.findUnique({
    where: { id },
    include: {
      question: {
        include: {
          quiz: true,
        },
      },
      result: true,
    },
  });

  return data;
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.quiz_option.findUnique({
    where: { id },
  });

  return data;
};

const createNew = async (info: createOptionInputTypes) => {
  const data = await db.quiz_option.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateOptionInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.quiz_option.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.quiz_option.delete({
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
  getMultiByTeamId,
  getSingleWithTeamInfo,
};
