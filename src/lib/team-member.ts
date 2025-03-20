import db from "../db/db";
import {
  teamMemberQueryInputTypes,
  createTeamMemberInputTypes,
  updateTeamMemberInputTypes,
} from "../schemas/team-member";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: teamMemberQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.team_members.findMany({
      where: {
        user: {
          full_name: {
            startsWith: queries.search || undefined,
          },
          mobile: {
            startsWith: queries.search || undefined,
          },
        },
        team: {
          title: {
            startsWith: queries.search || undefined,
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        created_at: queries.sort,
      },
    }),
    db.team_members.count({
      where: {
        user: {
          full_name: {
            startsWith: queries.search || undefined,
          },
          mobile: {
            startsWith: queries.search || undefined,
          },
        },
        team: {
          title: {
            startsWith: queries.search || undefined,
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
  const data = await db.team_members.findUnique({
    where: { id },
  });

  return data;
};

const createNew = async (info: createTeamMemberInputTypes) => {
  const data = await db.team_members.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateTeamMemberInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.team_members.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.team_members.delete({
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
