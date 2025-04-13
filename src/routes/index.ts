import { Router } from "express";
import { authRoutes } from "./v1/auth";
import { cmsRoutes } from "./v1/cms";
import { userRoutes } from "./v1/user";
import { verifyToken } from "../middlewares/verify-token";
import { quizRouter } from "./v1/quiz";

const router = Router();

router.use("/auth/v1", authRoutes);
router.use("/cms/v1", verifyToken, cmsRoutes);
router.use("/user/v1", verifyToken, userRoutes);
router.use("/quiz/v1", verifyToken, quizRouter);

export default router;
