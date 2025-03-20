import { Response, Request, NextFunction } from "express-serve-static-core";
import * as jwt from "jsonwebtoken";
import { AuthUser } from "../types/auth";
import { forbiddenError, unauthorizedError } from "../utils/errors";

export function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction
): any {
  try {
    const authHeader = request.headers["authorization"];

    if (!authHeader?.startsWith("Bearer ")) {
      forbiddenError("Invalid token");
    }

    const token = authHeader && authHeader?.split(" ")[1]; // token example: Bearer <TOKEN>

    if (token == null) {
      unauthorizedError("Invalid token");
    }

    jwt.verify(
      token as string,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, user) => {
        if (err) forbiddenError("Invalid token");

        request.user = user as AuthUser;
        next();
      }
    );
  } catch (error) {
    next(error);
  }
}
