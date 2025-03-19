import { Router } from "express";
import { authRoutes } from "./v1/auth";
import { cmsRoutes } from "./v1/cms";
import { userRoutes } from "./v1/user";

const router = Router();

router.use("/auth/v1", authRoutes);
router.use("/cms/v1", cmsRoutes);
router.use("/user/v1", userRoutes);

export default router;
