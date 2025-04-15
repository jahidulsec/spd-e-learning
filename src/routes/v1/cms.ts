import { Router } from "express";
import controller from "../../api/v1/cms";
import { authorize } from "../../middlewares/authorize";

const router = Router();

// category
router
  .route("/category")
  .get(controller.getCategories)
  .post(authorize("categories", "create"), controller.createCategory);

router
  .route("/category/:id")
  .get(controller.getCategory)
  .patch(controller.updateCategory)
  .delete(controller.delCategory);

// folder
router
  .route("/folder")
  .get(controller.getFolders)
  .post(authorize("folders", "create"), controller.createFolder);

router
  .route("/folder/:id")
  .get(controller.getFolder)
  .patch(controller.updateFolder)
  .delete(controller.delFolder);

// file
router
  .route("/file")
  .get(controller.getFiles)
  .post(authorize("files", "create"), controller.createFile);

router
  .route("/file/:id")
  .get(controller.getFile)
  .patch(controller.updateFile)
  .delete(controller.delFile);

// campaign
router
  .route("/campaign")
  .get(controller.getCampaigns)
  .post(authorize("campaign", "create"), controller.createCampaign);

router
  .route("/campaign/:id")
  .get(controller.getCampaign)
  .patch(controller.updateCampaign)
  .delete(controller.delCampaign);

export { router as cmsRoutes };
