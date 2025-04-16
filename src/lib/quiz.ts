import db from "../db/db";
import {
  createQuizInputTypes,
  updateQuizInputTypes,
  quizQueryInputTypes,
} from "../schemas/quiz";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: quizQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.quiz.findMany({
      where: {
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search,
              },
            },
            {
              quater: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team_id: queries.search,
            },
          ],
        }),
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        created_at: queries.sort,
      },
    }),
    db.quiz.count({
      where: {
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search,
              },
            },
            {
              quater: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team_id: queries.search,
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
  queries: quizQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.quiz.findMany({
      where: {
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search,
              },
            },
            {
              quater: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team_id: queries.search,
            },
          ],
        }),
        team_id: teamId || "",
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        created_at: queries.sort,
      },
    }),
    db.quiz.count({
      where: {
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search,
              },
            },
            {
              quater: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team_id: queries.search,
            },
          ],
        }),
        team_id: teamId || "",
      },
    }),
  ]);

  return { data, count };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const [data, duration] = await Promise.all([
    db.quiz.findUnique({
      where: { id },
      include: {
        quater: true,
      },
    }),
    db.question.count({
      where: {
        quiz_id: id,
      },
    }),
  ]);

  return { data, duration };
};

const createNew = async (info: createQuizInputTypes) => {
  const data = await db.quiz.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateQuizInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.quiz.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.quiz.delete({
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
};
