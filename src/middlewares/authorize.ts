import { Request, Response, NextFunction } from "express-serve-static-core";
import { forbiddenError } from "../utils/errors";
import userService from "../lib/user";
import { hasPermission, Permissions, User } from "../policy/policy";

export const authorize = <Resource extends keyof Permissions>(
  resourse: Resource,
  action: Permissions[Resource]["action"]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = req.user;

      if (!authUser) {
        forbiddenError("Your are unauthorized");
      }

      // get user info
      const user = await userService.getSingleWithTeamInfo(
        authUser?.id as string
      );

      // check permission
      const isPermitted = hasPermission(user as User, resourse, action);

      if (!isPermitted) {
        forbiddenError(`User with role - ${user?.role} has no permission to do this action (${action}) on ${resourse}`);
      }

      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
};
