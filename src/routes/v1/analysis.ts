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
  verifyRoles("director", "superadmin", "team_lead"),
  controller.getMioPerformance
);

export { router as analysisRoutes };
