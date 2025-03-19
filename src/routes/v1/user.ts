import { Router } from "express";
import controller from "../../api/v1/user";
import { verifyToken } from "../../middlewares/verify-token";

const router = Router();

// user
router.route("/user").get(controller.getUsers).post(controller.createUser);

router
  .route("/user/:id")
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.delUser);

export { router as userRoutes };
