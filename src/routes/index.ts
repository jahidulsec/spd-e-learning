import { Router } from "express";
import { authRoutes } from "./v1/auth";
import { cmsRoutes } from "./v1/cms";

const router = Router();

router.use("/auth/v1", authRoutes);
router.use("/cms/v1", cmsRoutes);

export default router;
