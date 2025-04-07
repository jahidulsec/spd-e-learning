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
        ...(queries.search && {
          OR: [
            {
              user: {
                full_name: {
                  startsWith: queries.search,
                },
              },
            },
            {
              user: {
                sap_id: {
                  startsWith: queries.search,
                },
              },
            },
            {
              user: {
                mobile: {
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
          ],
        }),
      },
      include: {
        user: true,
        team: {
          select: {
            title: true,
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
        ...(queries.search && {
          OR: [
            {
              user: {
                full_name: {
                  startsWith: queries.search,
                },
              },
            },
            {
              user: {
                sap_id: {
                  startsWith: queries.search,
                },
              },
            },
            {
              user: {
                mobile: {
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
          ],
        }),
      },
    }),
  ]);

  return { data, count };
};

const getMultiByTeamId = async (
  id: string,
  queries: teamMemberQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.team_members.findMany({
      where: {
        ...(queries.search && {
          AND: [
            { team_id: id || "0" },
            {
              OR: [
                {
                  user: {
                    full_name: {
                      startsWith: queries.search,
                    },
                  },
                },
                {
                  user: {
                    sap_id: {
                      startsWith: queries.search,
                    },
                  },
                },
                {
                  user: {
                    mobile: {
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
              ],
            },
          ],
        }),
      },
      include: {
        user: true,
        team: {
          select: {
            title: true,
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
        ...(queries.search && {
          AND: [
            { team_id: id || "0" },
            {
              OR: [
                {
                  user: {
                    full_name: {
                      startsWith: queries.search,
                    },
                  },
                },
                {
                  user: {
                    sap_id: {
                      startsWith: queries.search,
                    },
                  },
                },
                {
                  user: {
                    mobile: {
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
              ],
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
  const data = await db.team_members.findUnique({
    where: { id },
    include: {
      user: true,
      team: {
        select: {
          title: true,
        },
      },
    },
  });

  return data;
};

const getSingleByTeamId = async (id: string, teamId: string) => {
  //extract id from validated id by zod
  const data = await db.team_members.findUnique({
    where: { id: id, team_id: teamId },
    include: {
      user: true,
      team: {
        select: {
          title: true,
        },
      },
    },
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
  getMultiByTeamId,
  getSingleByTeamId,
};
