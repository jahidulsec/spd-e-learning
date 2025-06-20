import { Router } from "express";
import controller from "../../api/v1/user";
import { verifyRoles } from "../../middlewares/verify-roles";

const router = Router();

// user
router
  .route("/user")
  .get(verifyRoles("superadmin", "director"), controller.getUsers)
  .post(verifyRoles("superadmin"), controller.createUser);

router
  .route("/user/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(verifyRoles("superadmin"), controller.delUser);

router.get(
  "/stats",
  verifyRoles("director", "superadmin", "team_lead"),
  controller.getUserStats
);

// team
router
  .route("/team")
  .get(verifyRoles("superadmin", "director"), controller.getTeams)
  .post(verifyRoles("superadmin"), controller.createTeam);

router
  .route("/team/:id")
  .get(controller.getTeam)
  .patch(verifyRoles("superadmin", "team_lead"), controller.updateTeam)
  .delete(verifyRoles("superadmin"), controller.delTeam);

router.get(`/stats/team`, controller.getTeamStats)

// team
router
  .route("/team-member")
  .get(controller.getTeamMembers)
  .post(verifyRoles("superadmin"), controller.createTeamMember);

router
  .route("/team-member/:id")
  .get(controller.getTeamMember)
  .patch(verifyRoles("superadmin"), controller.updateTeamMember)
  .delete(verifyRoles("superadmin"), controller.delTeamMember);

export { router as userRoutes };
