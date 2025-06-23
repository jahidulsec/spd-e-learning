import db from "../db/db";
import {
  createResultInputTypes,
  resultQueryInputTypes,
  updateResultInputTypes,
} from "../schemas/result";
import { requiredIdTypes } from "../schemas/required-id";
import { ResultMioQuizAll } from "../types/result";
import { e_detailing_score } from "@prisma/client";
import { getYearRange } from "../utils/helper";

const getMulti = async (queries: resultQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.result.findMany({
      where: {
        ...(queries.search && {
          OR: [
            {
              team_member: {
                user: {
                  full_name: {
                    startsWith: queries.search ?? undefined,
                  },
                },
              },
            },
            {
              team_member: {
                user: {
                  sap_id: {
                    startsWith: queries.search ?? undefined,
                  },
                },
              },
            },
          ],
        }),
        answer: {
          question: {
            quiz_id: queries.quiz_id ?? undefined,
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        created_at: queries.sort,
      },
    }),
    db.result.count({
      where: {
        ...(queries.search && {
          OR: [
            {
              team_member: {
                user: {
                  full_name: {
                    startsWith: queries.search ?? undefined,
                  },
                },
              },
            },
            {
              team_member: {
                user: {
                  sap_id: {
                    startsWith: queries.search ?? undefined,
                  },
                },
              },
            },
          ],
        }),
        answer: {
          question: {
            quiz_id: queries.quiz_id ?? undefined,
          },
        },
      },
    }),
  ]);

  return { data, count };
};

const getMultiByUserId = async (
  userId: string,
  queries: resultQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.result.findMany({
      where: {
        team_member: {
          user_id: userId || "",
        },
        ...(queries.search && {
          OR: [
            {
              team_member: {
                user: {
                  full_name: {
                    startsWith: queries.search ?? undefined,
                  },
                },
              },
            },
            {
              team_member: {
                user: {
                  sap_id: {
                    startsWith: queries.search ?? undefined,
                  },
                },
              },
            },
          ],
        }),
        answer: {
          question: {
            quiz_id: queries.quiz_id ?? undefined,
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        created_at: queries.sort,
      },
    }),
    db.result.count({
      where: {
        team_member: {
          user_id: userId || "",
        },
        ...(queries.search && {
          OR: [
            {
              team_member: {
                user: {
                  full_name: {
                    startsWith: queries.search ?? undefined,
                  },
                },
              },
            },
            {
              team_member: {
                user: {
                  sap_id: {
                    startsWith: queries.search ?? undefined,
                  },
                },
              },
            },
          ],
        }),
        answer: {
          question: {
            quiz_id: queries.quiz_id ?? undefined,
          },
        },
      },
    }),
  ]);

  return { data, count };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.result.findUnique({
    where: { id },
    include: {
      team_member: true,
      answer: {
        include: {
          question: {
            include: {
              quiz: true,
            },
          },
        },
      },
    },
  });

  return data;
};

const getSingleMioAllByUserId = async (
  userId: string
): Promise<{
  quizData: ResultMioQuizAll[];
  eDetailingData: e_detailing_score[];
}> => {
  const year = new Date().getFullYear();

  //extract id from validated id by zod
  const [quizData, eDetailingData]: any = await Promise.all([
    db.$queryRaw`
      select
        u.full_name,
        u.sap_id,
        tm.team_id team_id,
        q.id quiz_id,
        q.title quiz_title,
        sum(r.score) quiz_score,
        count(qu.id) total_question
      from
        users u
        LEFT JOIN team_members tm on tm.user_id = u.sap_id
        LEFT JOIN quiz q on q.team_id = tm.team_id
        LEFT JOIN question qu on qu.quiz_id = q.id
        LEFT JOIN result r on r.question_id = qu.id
      WHERE
        u.role = 'mios'
        and tm.id is not null
        and u.sap_id = ${userId}
        AND (
            EXTRACT(
                YEAR
                FROM r.created_at
            ) = ${year}
        )
      GROUP BY
        q.id
      ORDER BY q.title ASC
    `,
    db.e_detailing_score.findMany({
      where: {
        e_detailing_video: {
          team_member: {
            user_id: userId,
          },
          created_at: getYearRange(year),
        },
      },
      include: {
        e_detailing_video: {
          select: {
            title: true,
          },
        },
      },
    }),
  ]);

  return { quizData, eDetailingData };
};

const getSingleByTeamMemberQuestion = async (
  teamMemberId: string,
  questionId: string
) => {
  const data = await db.result.findMany({
    where: {
      answer: {
        question_id: questionId,
      },
      team_member_id: teamMemberId,
    },
  });

  return data;
};

const getSingleByUserId = async (userId: string, questionId: string) => {
  const data = await db.result.findMany({
    where: {
      answer: {
        question_id: questionId,
      },
      team_member: {
        user_id: userId || "",
      },
    },
  });

  return data;
};

const createNew = async (info: createResultInputTypes) => {
  const { question_id, team_member_id, ...rest } = info;

  const data = await db.result.create({
    data: {
      ...rest,
      team_member_id: team_member_id ?? "",
      question_id: question_id ?? "",
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateResultInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.result.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.result.delete({
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
  getMultiByUserId,
  getSingleByTeamMemberQuestion,
  getSingleByUserId,
  getSingleMioAllByUserId,
};
