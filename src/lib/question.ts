import db from "../db/db";
import {
  createQuestionInputTypes,
  updateQuestionInputTypes,
  questionQueryInputTypes,
} from "../schemas/question";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: questionQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.question.findMany({
      where: {
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search || undefined,
              },
            },
            {
              quiz: {
                title: {
                  startsWith: queries.search || undefined,
                },
              },
            },
            {
              quiz: {
                id: {
                  startsWith: queries.search || undefined,
                },
              },
            },
          ],
        }),
      },
      include: {
        quiz_option: true,
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        title: queries.sort,
      },
    }),
    db.question.count({
      where: {
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search || undefined,
              },
            },
            {
              quiz: {
                title: {
                  startsWith: queries.search || undefined,
                },
              },
            },
            {
              quiz: {
                id: {
                  startsWith: queries.search || undefined,
                },
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
  queries: questionQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.question.findMany({
      where: {
        quiz: {
          team_id: teamId || "",
        },
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search || undefined,
              },
            },
            {
              quiz: {
                title: {
                  startsWith: queries.search || undefined,
                },
              },
            },
            {
              quiz: {
                id: {
                  startsWith: queries.search || undefined,
                },
              },
            },
          ],
        }),
      },
      include: {
        quiz_option: true,
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        title: queries.sort,
      },
    }),
    db.question.count({
      where: {
        quiz: {
          team_id: teamId || "",
        },
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search || undefined,
              },
            },
            {
              quiz: {
                title: {
                  startsWith: queries.search || undefined,
                },
              },
            },
            {
              quiz: {
                id: {
                  startsWith: queries.search || undefined,
                },
              },
            },
          ],
        }),
      },
    }),
  ]);

  return { data, count };
};

const getMultiByUserId = async (
  userId: string,
  queries: questionQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.question.findMany({
      where: {
        quiz: {
          team: {
            team_members: {
              some: {
                user_id: userId || "",
              },
            },
          },
        },
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search || undefined,
              },
            },
            {
              quiz: {
                title: {
                  startsWith: queries.search || undefined,
                },
              },
            },
            {
              quiz: {
                id: {
                  startsWith: queries.search || undefined,
                },
              },
            },
          ],
        }),
      },
      include: {
        quiz_option: true,
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        title: queries.sort,
      },
    }),
    db.question.count({
      where: {
        quiz: {
          team: {
            team_members: {
              some: {
                user_id: userId || "",
              },
            },
          },
        },
        ...(queries.search && {
          OR: [
            {
              title: {
                startsWith: queries.search || undefined,
              },
            },
            {
              quiz: {
                title: {
                  startsWith: queries.search || undefined,
                },
              },
            },
            {
              quiz: {
                id: {
                  startsWith: queries.search || undefined,
                },
              },
            },
          ],
        }),
      },
    }),
  ]);

  return { data, count };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.question.findUnique({
    where: { id },
    include: {
      quiz: true,
      quiz_option: true,
    },
  });

  return data;
};

const getSingleWithTeamInfo = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.question.findUnique({
    where: { id },
    include: {
      quiz: {
        include: {
          team: {
            include: {
              team_members: true,
            },
          },
        },
      },
      quiz_option: true,
    },
  });

  return data;
};

const createNew = async (info: createQuestionInputTypes) => {
  const { quiz_id, options, ...rest } = info;

  const data = await db.question.create({
    data: {
      title: info.title,
      quiz_id: info.quiz_id,
      quiz_option: {
        createMany: {
          data: options,
        },
      },
    },
    include: {
      quiz_option: true,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateQuestionInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.question.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.question.delete({
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
  getMultiByUserId
};
