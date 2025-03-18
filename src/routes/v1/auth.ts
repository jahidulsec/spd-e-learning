import { Router } from "express";
import controller from "../../api/v1/auth";

const router = Router();

router.post("/user/login", controller.login);
router.post("/user/forget-password", controller.forgetPassword);
router.post("/user/confirm-otp/:id", controller.confirmOtp);

export { router as authRoutes };
