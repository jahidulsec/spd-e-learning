import db from "../db/db";
import {
  quaterQueryInputTypes,
  createQuaterInputTypes,
  updateQuaterInputTypes,
} from "../schemas/quater";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: quaterQueryInputTypes) => {
  const size = Number(queries.size) ?? 20;
  const page = Number(queries.page) ?? 20;

  const [data, count] = await Promise.all([
    db.quater.findMany({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        start_date: {
          gte: queries?.start_date ?? undefined,
        },
        end_date: {
          lte: queries?.end_date ?? undefined,
        },
        ...(queries.is_archived && {
          is_archived: queries.is_archived === "1",
        }),
      },
      take: size,
      skip: size * (page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort ?? "desc",
      },
    }),
    db.quater.count({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        start_date: {
          gte: queries?.start_date ?? undefined,
        },
        end_date: {
          lte: queries?.end_date ?? undefined,
        },
        ...(queries.is_archived && {
          is_archived: queries.is_archived === "1",
        }),
      },
    }),
  ]);

  return { data, count };
};

const getMultiForTeams = async (
  queries: quaterQueryInputTypes,
  teamId: string
) => {
  const size = Number(queries.size) ?? 20;
  const page = Number(queries.page) ?? 20;

  const [data, count] = await Promise.all([
    db.quater.findMany({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        start_date: {
          gte: queries?.start_date ?? undefined,
        },
        end_date: {
          lte: queries?.end_date ?? undefined,
        },
        ...(queries.is_archived && {
          is_archived: queries.is_archived === "1",
        }),
      },
      include: {
        e_detailing: {
          where: {
            team_id: teamId,
          },
        },
        quiz: {
          where: {
            team_id: teamId,
          },
        },
      },
      take: size,
      skip: size * (page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort ?? "desc",
      },
    }),
    db.quater.count({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        start_date: {
          gte: queries?.start_date ?? undefined,
        },
        end_date: {
          lte: queries?.end_date ?? undefined,
        },
        ...(queries.is_archived && {
          is_archived: queries.is_archived === "1",
        }),
      },
    }),
  ]);

  return { data, count };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.quater.findUnique({
    where: { id },
  });

  return data;
};

const createNew = async (info: createQuaterInputTypes) => {
  const data = await db.quater.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateQuaterInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.quater.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.quater.delete({
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
  getMultiForTeams,
};
