import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import controller from "../../api/v1/other";
import { verifyRoles } from "../../middlewares/verify-roles";

const router = Router();

router
  .route("/quater")
  .get(authorize("quater", "view"), controller.getQuaters)
  .post(authorize("quater", "create"), controller.createQuater);

router
  .route("/quater/:id")
  .get(authorize("quater", "view"), controller.getQuater)
  .patch(authorize("quater", "view"), controller.updateQuater)
  .delete(authorize("quater", "view"), controller.delQuater);

// get team information
router.get(
  `/:teamId/quater`,
  verifyRoles("superadmin", "team_lead", "director"),
  controller.getQuatersTeams
);

export { router as otherRouter };
