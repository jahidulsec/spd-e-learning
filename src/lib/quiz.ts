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
      include: {
        quater: true,
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
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
      include: {
        quater: true,
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
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

const getMultiByUserId = async (
  userId: string,
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
        team: {
          team_members: {
            some: {
              user_id: userId || "",
            },
          },
        },
      },
      include: {
        quater: true,
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
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
        team: {
          team_members: {
            some: {
              user_id: userId || "",
            },
          },
        },
      },
    }),
  ]);

  return { data, count };
};

const getMultiByTeamIdWithTeamMember = async (
  teamId: string,
  teamMemberId: string,
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
      include: {
        quater: true,
        quiz_member: {
          where: {
            team_member_id: teamMemberId,
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
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

const getMultiByUserIdWithTeamMember = async (
  userId: string,
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
        team: {
          team_members: {
            some: {
              user_id: userId || "",
            },
          },
        },
      },
      include: {
        quater: true,
        quiz_member: {
          where: {
            team_member: {
              user_id: userId || "",
            },
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
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
        team: {
          team_members: {
            some: {
              user_id: userId || "",
            },
          },
        },
      },
    }),
  ]);

  return { data, count };
};

const getQuizUserResult = async (
  quizId: string,
  queries: quizQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.quiz_member.findMany({
      where: {
        quiz_id: quizId,
        ...(queries.search && {
          OR: [
            {
              team_member: {
                user: {
                  full_name: queries.search,
                },
              },
            },
            {
              team_member: {
                user: {
                  sap_id: queries.search,
                },
              },
            },
          ],
        }),
      },
      include: {
        team_member: {
          include: {
            user: {
              select: {
                full_name: true,
                sap_id: true,
              },
            },
          },
        },
        quiz: {
          select: {
            _count: {
              select: {
                question: true,
              },
            },
            question: {
              select: {
                result: {
                  select: {
                    score: true,
                  },
                },
              },
            },
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        ...(queries.sort_type === "title" && {
          team_member: {
            user: {
              full_name: queries.sort,
            },
          },
        }),
        ...(queries.sort_type === "created_at" && {
          created_at: queries.sort,
        }),
      },
    }),
    db.quiz_member.count({
      where: {
        quiz_id: quizId,
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

const getSingleWithQuestionByTeamMemberId = async (
  quizId: string,
  teamMemberId: string
) => {
  //extract id from validated id by zod
  const [data] = await Promise.all([
    db.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        quater: true,
        question: {
          include: {
            quiz_option: {
              include: {
                result: {
                  where: {
                    team_member_id: teamMemberId,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  return data;
};

const getSingleWithQuestionByUserId = async (
  quizId: string,
  userId: string
) => {
  //extract id from validated id by zod
  const [data] = await Promise.all([
    db.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        quater: true,
        question: {
          include: {
            quiz_option: {
              include: {
                result: {
                  where: {
                    team_member: {
                      user_id: userId || "",
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  return data;
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
  getMultiByTeamIdWithTeamMember,
  getSingleWithQuestionByTeamMemberId,
  getMultiByUserId,
  getMultiByUserIdWithTeamMember,
  getSingleWithQuestionByUserId,
  getQuizUserResult,
};
