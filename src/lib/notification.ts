import { Prisma } from "@prisma/client";
import db from "../db/db";
import {
  createNotificationInputTypes, updateNotificationInputTypes, NotificationQueryInputTypes
} from "../schemas/notification";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: NotificationQueryInputTypes) => {

  const { user_id } = queries;

  const filter: Prisma.notificationWhereInput = {
    ...(user_id && {
      teams: {
        team_members: {
          some: {
            user_id: user_id
          }
        }
      }
    })
  }

  const [data, count] = await Promise.all([
    db.notification.findMany({
      where: filter,

      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
      },
    }),
    db.notification.count({
      where: filter,
    }),
  ]);

  return { data, count };
};



const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.category.findUnique({
    where: { id },
  });

  return data;
};

const createNew = async (info: createNotificationInputTypes) => {

  const { team_id, ...rest } = info

  const data = await db.notification.create({
    data: {
      team_id: team_id as string,
      ...rest,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateNotificationInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.notification.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.notification.delete({
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
