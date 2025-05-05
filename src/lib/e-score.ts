import { randomUUID } from "crypto";
import db from "../db/db";
import {
  createEScoreInputTypes,
  updateEScoreInputTypes,
  eScoreQueryInputTypes,
} from "../schemas/e-score";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: eScoreQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.e_detailing_score.findMany({
      where: {
        e_detailing_video: {
          title: {
            startsWith: queries.search || undefined,
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      include: {
        e_detailing_video: {
          include: {
            e_detailing: true,
          },
        },
      },
      orderBy: {
        ...(queries.sort_type === "created_at"
          ? {
              created_at: queries.sort,
            }
          : {
              e_detailing_video: {
                title: queries.sort,
              },
            }),
      },
    }),
    db.e_detailing_score.count({
      where: {
        e_detailing_video: {
          title: {
            startsWith: queries.search || undefined,
          },
        },
      },
    }),
  ]);

  return { data, count };
};

const getMultiByTeamId = async (
  teamId: string,
  queries: eScoreQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.e_detailing_score.findMany({
      where: {
        e_detailing_video: {
          team_member: {
            team_id: teamId || "",
          },
          title: {
            startsWith: queries.search || undefined,
          },
        },
      },
      include: {
        e_detailing_video: {
          include: {
            e_detailing: true,
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        ...(queries.sort_type === "created_at"
          ? {
              created_at: queries.sort,
            }
          : {
              e_detailing_video: {
                title: queries.sort,
              },
            }),
      },
    }),
    db.e_detailing_score.count({
      where: {
        e_detailing_video: {
          team_member: {
            team_id: teamId || "",
          },
          title: {
            startsWith: queries.search || undefined,
          },
        },
      },
    }),
  ]);

  return { data, count };
};

const getMultiByUserId = async (
  userId: string,
  queries: eScoreQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.e_detailing_score.findMany({
      where: {
        e_detailing_video: {
          team_member: {
            user_id: userId || "",
          },
          title: {
            startsWith: queries.search || undefined,
          },
        },
      },
      include: {
        e_detailing_video: {
          include: {
            e_detailing: true,
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        ...(queries.sort_type === "created_at"
          ? {
              created_at: queries.sort,
            }
          : {
              e_detailing_video: {
                title: queries.sort,
              },
            }),
      },
    }),
    db.e_detailing_score.count({
      where: {
        e_detailing_video: {
          team_member: {
            user_id: userId || "",
          },
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
  const data = await db.e_detailing_score.findUnique({
    where: { id },
    include: {
      e_detailing_video: {
        include: {
          team_member: true,
          e_detailing: true,
        },
      },
    },
  });

  return data;
};

const createNew = async (info: createEScoreInputTypes) => {
  const data = await db.e_detailing_score.create({
    data: {
      video_id: info.video_id,
      score_closing: info.score_closing,
      score_content: info.score_content,
      score_presentation: info.score_presentation,
      score_starting: info.score_starting,
      comment: info.comment,
      scored_by: info.scored_by,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateEScoreInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.e_detailing_score.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.e_detailing_score.delete({
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
