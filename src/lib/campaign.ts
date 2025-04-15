import db from "../db/db";
import {
  campaignQueryInputTypes,
  createCampaignInputTypes,
  updateCampaignInputTypes,
} from "../schemas/campaign";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: campaignQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.campaign.findMany({
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
    db.campaign.count({
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
  queries: campaignQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.campaign.findMany({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        team_id: teamId,
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        created_at: queries.sort,
      },
    }),
    db.campaign.count({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        team_id: teamId,
      },
    }),
  ]);

  return { data, count };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.campaign.findUnique({
    where: { id },
  });

  return data;
};

const createNew = async (info: createCampaignInputTypes) => {
  const data = await db.campaign.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateCampaignInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.campaign.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.campaign.delete({
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
