import { Prisma } from "@prisma/client";
import db from "../db/db";
import {
  createNotificationUserInputTypes, updateNotificationUserInputTypes, NotificationUserQueryInputTypes
} from "../schemas/notification-user";
import { requiredIdTypes } from "../schemas/required-id";

const getMulti = async (queries: NotificationUserQueryInputTypes) => {


  const filter: Prisma.notification_userWhereInput = {
    ...(queries.search && {
      notification: {
        title: {
          contains: queries.search,
        }
      }
    })
  }

  const [data, count] = await Promise.all([
    db.notification_user.findMany({
      where: filter,
      take: queries.size,
      skip: queries.size * (queries.page - 1),
      orderBy: {
        [queries.sort_type]: queries.sort,
      },
    }),
    db.notification_user.count({
      where: filter,
    }),
  ]);

  return { data, count };
};



const getSingle = async (idObj: requiredIdTypes) => {
  const { id } = idObj;

  //extract id from validated id by zod
  const data = await db.notification_user.findUnique({
    where: { id },
  });

  return data;
};

const createNew = async (info: createNotificationUserInputTypes) => {
  const data = await db.notification_user.create({
    data: {
      ...info,
    },
  });

  return data;
};

const updateOne = async (
  idObj: requiredIdTypes,
  info: updateNotificationUserInputTypes
) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const updatedData = await db.notification_user.update({
    where: { id: id },
    data: { ...info },
  });
  return updatedData;
};

const deleteOne = async (idObj: requiredIdTypes) => {
  //extract id from validated id by zod
  const { id } = idObj;

  const deleted = await db.notification_user.delete({
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
