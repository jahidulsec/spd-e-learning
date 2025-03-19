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

export { router as userRoutes };
