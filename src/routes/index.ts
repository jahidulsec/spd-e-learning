import { Router } from "express";
import { authRoutes } from "./v1/auth";
import { cmsRoutes } from "./v1/cms";
import { userRoutes } from "./v1/user";
import { verifyToken } from "../middlewares/verify-token";
import { quizRouter } from "./v1/quiz";
import { otherRouter } from "./v1/other";
import { eDetailingRoutes } from "./v1/e-detailing";

const router = Router();

router.use("/auth/v1", authRoutes);
router.use("/cms/v1", verifyToken, cmsRoutes);
router.use("/user/v1", verifyToken, userRoutes);
router.use("/other/v1", verifyToken, otherRouter);
router.use("/quiz/v1", verifyToken, quizRouter);
router.use("/e-detailing/v1", verifyToken, eDetailingRoutes);

export default router;
