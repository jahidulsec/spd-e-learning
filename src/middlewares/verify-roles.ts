import { NextFunction, Request, Response } from "express-serve-static-core";
import { unauthorizedError } from "../utils/errors";
import { $Enums } from "@prisma/client";

export const verifyRoles = (...allowedRoles: $Enums.role[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const authUser = request.user;
    if (!authUser) {
      unauthorizedError("Your are not permitted for this action");
    }
    if (authUser && !authUser.role) {
      unauthorizedError("Your are not permitted for this action");
    }

    const rolesArray = [...allowedRoles];

    // const result = (authUser as any)?.roles
    //   .map((role: any) => rolesArray.includes(role))
    //   .find((value: any) => value === true);

    const result = rolesArray.includes(authUser?.role as $Enums.role);

    if (!result) {
      unauthorizedError("Your are not permitted for this action");
    }
    next();
  };
};
