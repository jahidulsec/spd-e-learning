import { Router } from "express";
import controller from "../../api/v1/analysis";
import { verifyRoles } from "../../middlewares/verify-roles";

const router = Router();

// performance
router.get(
  "/stats/performance",
  verifyRoles("director", "superadmin", "team_lead"),
  controller.getTeamStats
);
router.get(
  `/performance/mios`,
  verifyRoles("director", "superadmin", "team_lead", "mios"),
  controller.getMioPerformance
);

// result
router.get(
  `/result/:userId`,
  controller.getSingleMioAllResult
);

export { router as analysisRoutes };
