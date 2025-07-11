import db from "../db/db";
import {
  createFolderInputTypes,
  updateFolderInputTypes,
  folderQueryInputTypes,
} from "../schemas/folder";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: folderQueryInputTypes) => {
  const [data, count] = await Promise.all([
    db.folder.findMany({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        parent_folder_id: null,
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    is_archived: queries.is_archived === "1",
                  },
                  {
                    category: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    category: {
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
                    is_archived: false,
                  },
                  {
                    category: {
                      is_archived: false,
                    },
                  },
                  {
                    category: {
                      quater: {
                        is_archived: false,
                      },
                    },
                  },
                ],
              })),
      },
      include: {
        category: {
          include: {
            quater: true,
          },
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
      },
    }),
    db.folder.count({
      where: {
        title: {
          startsWith: queries.search || undefined,
        },
        parent_folder_id: null,
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    is_archived: queries.is_archived === "1",
                  },
                  {
                    category: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    category: {
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
                    is_archived: false,
                  },
                  {
                    category: {
                      is_archived: false,
                    },
                  },
                  {
                    category: {
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
  queries: folderQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.folder.findMany({
      where: {
        category: {
          team_id: teamId || "",
        },
        parent_folder_id: null,
        title: {
          startsWith: queries.search || undefined,
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    is_archived: queries.is_archived === "1",
                  },
                  {
                    category: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    category: {
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
                    is_archived: false,
                  },
                  {
                    category: {
                      is_archived: false,
                    },
                  },
                  {
                    category: {
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
    db.folder.count({
      where: {
        category: {
          team_id: teamId || "",
        },
        parent_folder_id: null,
        title: {
          startsWith: queries.search || undefined,
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    is_archived: queries.is_archived === "1",
                  },
                  {
                    category: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    category: {
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
                    is_archived: false,
                  },
                  {
                    category: {
                      is_archived: false,
                    },
                  },
                  {
                    category: {
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
  queries: folderQueryInputTypes
) => {
  const [data, count] = await Promise.all([
    db.folder.findMany({
      where: {
        category: {
          team: {
            team_members: {
              some: {
                user_id: userId || "",
              },
            },
          },
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    is_archived: queries.is_archived === "1",
                  },
                  {
                    category: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    category: {
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
                    is_archived: false,
                  },
                  {
                    category: {
                      is_archived: false,
                    },
                  },
                  {
                    category: {
                      quater: {
                        is_archived: false,
                      },
                    },
                  },
                ],
              })),
        parent_folder_id: null,
        category_id: queries.category_id,
        title: {
          startsWith: queries.search || undefined,
        },
      },
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
      },
    }),
    db.folder.count({
      where: {
        category: {
          team: {
            team_members: {
              some: {
                user_id: userId || "",
              },
            },
          },
        },
        ...(queries.is_archived &&
          (queries.is_archived === "1"
            ? {
                OR: [
                  {
                    is_archived: queries.is_archived === "1",
                  },
                  {
                    category: {
                      is_archived: queries.is_archived === "1",
                    },
                  },
                  {
                    category: {
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
                    is_archived: false,
                  },
                  {
                    category: {
                      is_archived: false,
                    },
                  },
                  {
                    category: {
                      quater: {
                        is_archived: false,
                      },
                    },
                  },
                ],
              })),
        parent_folder_id: null,
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
  const data = await db.folder.findUnique({
    where: { id },
    include: {
      sub_folder: true,
    },
  });

  return data;
};

const getSingleWithTeamInfo = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.folder.findUnique({
    where: { id },
    include: {
      category: true,
      sub_folder: true,
      file: true,
    },
  });

  return data;
};

const createNew = async (info: createFolderInputTypes) => {
  const data = await db.folder.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateFolderInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.folder.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.folder.delete({
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
  getSingleWithTeamInfo,
  getMultiByTeamId,
  getMultiByUserId,
};
