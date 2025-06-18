import { createQuater } from "./quater/create";
import { getQuaters } from "./quater/get-multi";
import { getQuater } from "./quater/get-single";
import { updateQuater } from "./quater/update";
import { delQuater } from "./quater/delete";
import { getQuatersTeams } from "./quater/get-multi-team";

export = {
  createQuater,
  getQuater,
  getQuaters,
  delQuater,
  updateQuater,
  getQuatersTeams,
};
