// category
import { createCategory } from "./category/create";
import { getCategories } from "./category/get-multi";
import { getCategory } from "./category/get-single";
import { updateCategory } from "./category/update";
import { delCategory } from "./category/delete";

// folder
import { createFolder } from "./folder/create";
import { getFolders } from "./folder/get-multi";
import { getFolder } from "./folder/get-single";
import { updateFolder } from "./folder/update";
import { delFolder } from "./folder/delete";

// file
import { createFile } from "./file/create";
import { getFiles } from "./file/get-multi";
import { getFile } from "./file/get-single";
import { updateFile } from "./file/update";
import { delFile } from "./file/delete";

// campaign
import { createCampaign } from "./campaign/create";
import { getCampaigns } from "./campaign/get-multi";
import { getCampaign } from "./campaign/get-single";
import { updateCampaign } from "./campaign/update";
import { delCampaign } from "./campaign/delete";

export = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  delCategory,
  createFile,
  getFile,
  getFiles,
  updateFile,
  delFile,
  createFolder,
  getFolder,
  getFolders,
  updateFolder,
  delFolder,
  createCampaign,
  getCampaign,
  getCampaigns,
  updateCampaign,
  delCampaign,
};
