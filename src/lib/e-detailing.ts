import db from "../db/db";
import {
  eDetailingQueryInputTypes,
  createEDetailingInputTypes,
  updateEDetailingInputTypes,
} from "../schemas/e-detailing";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: eDetailingQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.e_detailing.findMany({
      where: {
        title: {
          startsWith: queries.search || undefined,
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
    db.e_detailing.count({
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
  queries: eDetailingQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.e_detailing.findMany({
      where: {
        team_id: teamId || "",
        title: {
          startsWith: queries.search || undefined,
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
    db.e_detailing.count({
      where: {
        team_id: teamId || "",
        title: {
          startsWith: queries.search || undefined,
        },
      },
    }),
  ]);

  return { data, count };
};

const getMultiByUserId = async (
  userId: string,
  queries: eDetailingQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.e_detailing.findMany({
      where: {
        team: {
          team_members: {
            some: {
              user_id: userId || "",
            },
          },
        },
        title: {
          startsWith: queries.search || undefined,
        },
      },
      include: {
        quater: true,
        e_detailing_video: {
          where: {
            team_member: {
              user_id: userId || "",
            },
          },
          select: {
            id: true
          }
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
      },
    }),
    db.e_detailing.count({
      where: {
        team: {
          team_members: {
            some: {
              user_id: userId || "",
            },
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
  const data = await db.e_detailing.findUnique({
    where: { id },
  });

  return data;
};

const createNew = async (info: createEDetailingInputTypes) => {
  const data = await db.e_detailing.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateEDetailingInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.e_detailing.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.e_detailing.delete({
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
  getMultiByUserId,
};
