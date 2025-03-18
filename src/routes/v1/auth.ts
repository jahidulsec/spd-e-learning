import { Router } from "express";
import controller from "../../api/v1/auth";
import { verifyToken } from "../../middlewares/verify-token";

const router = Router();

router.post("/user/login", controller.login);
router.post("/user/password/forget", controller.forgetPassword);
router.post("/user/confirm-otp/:id", controller.confirmOtp);
router.post("/user/password/reset", verifyToken, controller.resetPassoword);

export { router as authRoutes };
