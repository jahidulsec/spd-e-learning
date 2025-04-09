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

// sub folder
// router
//   .route("/sub-folder")
//   .get(controller.getSubFolders)
//   .post(authorize("subfolders", "create"), controller.createSubFolder);

// router
//   .route("/sub-folder/:id")
//   .get(controller.getSubFolder)
//   .patch(controller.updateSubFolder)
//   .delete(controller.delSubFolder);

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

export { router as cmsRoutes };
