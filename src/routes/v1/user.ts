import { Router } from "express";
import controller from "../../api/v1/user";
import { verifyToken } from "../../middlewares/verify-token";
import { verifyRoles } from "../../middlewares/verify-roles";

const router = Router();

// user
router
  .route("/user")
  .get(verifyToken, verifyRoles("superadmin"), controller.getUsers)
  .post(verifyToken, verifyRoles("superadmin"), controller.createUser);

router
  .route("/user/:id")
  .get(verifyToken, controller.getUser)
  .patch(verifyToken, controller.updateUser)
  .delete(verifyToken, verifyRoles("superadmin"), controller.delUser);

// team
router
  .route("/team")
  .get(verifyToken, verifyRoles("superadmin"), controller.getTeams)
  .post(verifyToken, verifyRoles("superadmin"), controller.createTeam);

router
  .route("/team/:id")
  .get(verifyToken, controller.getTeam)
  .patch(
    verifyToken,
    verifyRoles("superadmin", "team_lead"),
    controller.updateTeam
  )
  .delete(verifyToken, verifyRoles("superadmin"), controller.delTeam);

// team
router
  .route("/team/member")
  .get(verifyToken, verifyRoles("superadmin"), controller.getTeams)
  .post(verifyToken, verifyRoles("superadmin"), controller.createTeam);

router
  .route("/team/member/:id")
  .get(verifyToken, controller.getTeam)
  .patch(
    verifyToken,
    verifyRoles("superadmin", "team_lead"),
    controller.updateTeam
  )
  .delete(verifyToken, verifyRoles("superadmin"), controller.delTeam);

export { router as userRoutes };
