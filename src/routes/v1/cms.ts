import { Router } from "express";
import controller from "../../api/v1/cms";
import { authorize } from "../../middlewares/authorize";

const router = Router();

// category
router
  .route("/category")
  .get(controller.getCategories)
  .post(controller.createCategory);

router
  .route("/category/:id")
  .get(controller.getCategory)
  .patch(controller.updateCategory)
  .delete(controller.delCategory);

// folder
router
  .route("/folder")
  .get(controller.getFolders)
  .post(controller.createFolder);

router
  .route("/folder/:id")
  .get(controller.getFolder)
  .patch(controller.updateFolder)
  .delete(controller.delFolder);

// file
router.route("/file").get(controller.getFiles).post(controller.createFile);

router
  .route("/file/:id")
  .get(controller.getFile)
  .patch(controller.updateFile)
  .delete(controller.delFile);

export { router as cmsRoutes };
