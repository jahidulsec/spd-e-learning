import { Router } from "express";
import { authRoutes } from "./v1/auth";

const router = Router();

router.use("/auth/v1", authRoutes);

export default router;
