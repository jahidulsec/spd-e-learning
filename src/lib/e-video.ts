import db from "../db/db";
import {
  createEVdieoInputTypes,
  updateEVdieoInputTypes,
  eVdieoQueryInputTypes,
} from "../schemas/e-video";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: eVdieoQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.e_detailing_video.findMany({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        team_member: {
          team_id: queries.team_id,
        },
        e_detailing: {
          quater_id: queries.quater_id,
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    e_detailing: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: queries.is_archived === "1",
                      },
                    },
                  },
                ],
              }
            : {
                AND: [
                  {
                    e_detailing: {
                      is_archived: false,
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: false,
                      },
                    },
                  },
                ],
              })),
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
      },
    }),
    db.e_detailing_video.count({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        team_member: {
          team_id: queries.team_id,
        },
        e_detailing: {
          quater_id: queries.quater_id,
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    e_detailing: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: queries.is_archived === "1",
                      },
                    },
                  },
                ],
              }
            : {
                AND: [
                  {
                    e_detailing: {
                      is_archived: false,
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: false,
                      },
                    },
                  },
                ],
              })),
      },
    }),
  ]);

  return { data, count };
};

const getMultiByTeamId = async (
  teamId: string,
  queries: eVdieoQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.e_detailing_video.findMany({
      where: {
        team_member: {
          team_id: teamId || "",
        },
        title: {
          startsWith: queries.search || undefined,
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    e_detailing: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: queries.is_archived === "1",
                      },
                    },
                  },
                ],
              }
            : {
                AND: [
                  {
                    e_detailing: {
                      is_archived: false,
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: false,
                      },
                    },
                  },
                ],
              })),
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
      },
    }),
    db.e_detailing_video.count({
      where: {
        team_member: {
          team_id: teamId || "",
        },
        title: {
          startsWith: queries.search || undefined,
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    e_detailing: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: queries.is_archived === "1",
                      },
                    },
                  },
                ],
              }
            : {
                AND: [
                  {
                    e_detailing: {
                      is_archived: false,
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: false,
                      },
                    },
                  },
                ],
              })),
      },
    }),
  ]);

  return { data, count };
};

const getMultiByUserId = async (
  userId: string,
  queries: eVdieoQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.e_detailing_video.findMany({
      where: {
        team_member: {
          user_id: userId || "",
        },
        title: {
          startsWith: queries.search || undefined,
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    e_detailing: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: queries.is_archived === "1",
                      },
                    },
                  },
                ],
              }
            : {
                AND: [
                  {
                    e_detailing: {
                      is_archived: false,
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: false,
                      },
                    },
                  },
                ],
              })),
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
      },
    }),
    db.e_detailing_video.count({
      where: {
        team_member: {
          user_id: userId || "",
        },
        title: {
          startsWith: queries.search || undefined,
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    e_detailing: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: queries.is_archived === "1",
                      },
                    },
                  },
                ],
              }
            : {
                AND: [
                  {
                    e_detailing: {
                      is_archived: false,
                    },
                  },
                  {
                    e_detailing: {
                      quater: {
                        is_archived: false,
                      },
                    },
                  },
                ],
              })),
      },
    }),
  ]);

  return { data, count };
};

const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.e_detailing_video.findUnique({
    where: { id },
    include: {
      team_member: true,
      e_detailing: true,
    },
  });

  return data;
};

const createNew = async (info: createEVdieoInputTypes) => {
  const { team_member_id, ...rest } = info;

  const data = await db.e_detailing_video.create({
    data: {
      ...rest,
      team_member_id: team_member_id as string,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateEVdieoInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.e_detailing_video.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.e_detailing_video.delete({
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
