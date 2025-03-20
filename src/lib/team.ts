import db from "../db/db";
import {
  teamQueryInputTypes,
  createTeamInputTypes,
  updateTeamInputTypes,
} from "../schemas/team";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: teamQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.teams.findMany({
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
    db.teams.count({
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
  const data = await db.teams.findUnique({
    where: { id },
  });

  return data;
};

const createNew = async (info: createTeamInputTypes) => {
  const data = await db.teams.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateTeamInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.teams.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.teams.delete({
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
