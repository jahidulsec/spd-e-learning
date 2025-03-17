import { Router } from "express";
import controller from "../../api/v1/auth";

const router = Router();

router.post("/user/login", controller.login);

export { router as authRoutes };
