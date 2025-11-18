import { createQuater } from "./quater/create";
import { getQuaters } from "./quater/get-multi";
import { getQuater } from "./quater/get-single";
import { updateQuater } from "./quater/update";
import { delQuater } from "./quater/delete";
import { getQuatersTeams } from "./quater/get-multi-team";
import { getNotificaiton } from "./notification/get-single";
import { getNotifications } from "./notification/get-multi";
import { createNotification } from "./notification/create";
import { delNotification } from "./notification/delete";

export = {
  createQuater,
  getQuater,
  getQuaters,
  delQuater,
  updateQuater,
  getQuatersTeams,
  getNotificaiton, getNotifications, createNotification, delNotification
};
