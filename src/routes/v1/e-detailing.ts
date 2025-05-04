import { Router } from "express";
import controller from "../../api/v1/e-detailing";
import { authorize } from "../../middlewares/authorize";

const router = Router();

// topic
router
  .route("/topic")
  .get(controller.getTopics)
  .post(authorize("e_detailing", "create"), controller.createTopic);

router
  .route("/topic/:id")
  .get(controller.getTopic)
  .patch(controller.updateTopic)
  .delete(controller.delTopic);

// folder
// router
//   .route("/folder")
//   .get(controller.getFolders)
//   .post(authorize("folders", "create"), controller.createFolder);

// router
//   .route("/folder/:id")
//   .get(controller.getFolder)
//   .patch(controller.updateFolder)
//   .delete(controller.delFolder);

// file
// router
//   .route("/file")
//   .get(controller.getFiles)
//   .post(authorize("files", "create"), controller.createFile);

// router
//   .route("/file/:id")
//   .get(controller.getFile)
//   .patch(controller.updateFile)
//   .delete(controller.delFile);

export { router as eDetailingRoutes };
