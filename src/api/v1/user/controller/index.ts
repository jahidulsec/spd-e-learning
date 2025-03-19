import { createUser } from "./user/create";
import { getUsers } from "./user/get-multi";
import { getUser } from "./user/get-single";
import { delUser } from "./user/delete";
import { updateUser } from "./user/update";

export = {
  createUser,
  getUser,
  getUsers,
  delUser,
  updateUser,
};
