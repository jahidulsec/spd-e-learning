import { NextFunction, Request, Response } from "express-serve-static-core";
import { forbiddenError } from "../utils/errors";
import { $Enums } from "@prisma/client";

export const verifyRoles = (...allowedRoles: $Enums.role[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const authUser = request.user;
    if (!authUser) {
      forbiddenError("Your are not permitted for this action");
    }
    if (authUser && !authUser.role) {
      forbiddenError("Your are not permitted for this action");
    }

    const rolesArray = [...allowedRoles];

    // const result = (authUser as any)?.roles
    //   .map((role: any) => rolesArray.includes(role))
    //   .find((value: any) => value === true);

    const result = rolesArray.includes(authUser?.role as $Enums.role);

    if (!result) {
      forbiddenError("Your are not permitted for this action");
    }
    next();
  };
};
