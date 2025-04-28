import db from "../db/db";
import {
  createQuizMemberInputTypes,
  updateQuizMemberInputTypes,
  quizMemberQueryInputTypes,
} from "../schemas/quiz-member";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: quizMemberQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.quiz_member.findMany({
      where: {
        ...(queries.search && {
          OR: [
            {
              quiz: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team_member: {
                user: {
                  full_name: {
                    startsWith: queries.search,
                  },
                },
              },
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
    db.quiz_member.count({
      where: {
        ...(queries.search && {
          OR: [
            {
              quiz: {
                title: {
                  startsWith: queries.search,
                },
              },
            },
            {
              team_member: {
                user: {
                  full_name: {
                    startsWith: queries.search,
                  },
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
  const [data] = await Promise.all([
    db.quiz_member.findUnique({
      where: { id },
    }),
  ]);

  return data;
};

const createNew = async (info: createQuizMemberInputTypes) => {
  const data = await db.quiz_member.create({
    data: {
      quiz_id: info.quiz_id,
      team_member_id: info.team_member_id ?? ""
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateQuizMemberInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.quiz_member.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.quiz_member.delete({
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
