import { Router } from "express";
import controller from "../../api/v1/e-detailing";
import { authorize } from "../../middlewares/authorize";
import { verifyRoles } from "../../middlewares/verify-roles";

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

router.get(
  "/topic/:id/leaderboard",
  verifyRoles("director", "superadmin", "team_lead"),
  controller.getEDetailingLeaderboard
);

// video
router.route("/video").get(controller.getVideos).post(controller.createVideo);

router
  .route("/video/:id")
  .get(controller.getVideo)
  .patch(controller.updateVideo)
  .delete(controller.delVideo);

// score
router.route("/score").get(controller.getScores).post(controller.createScore);

router
  .route("/score/:id")
  .get(controller.getScore)
  .patch(controller.updateScore)
  .delete(controller.delScore);

export { router as eDetailingRoutes };
