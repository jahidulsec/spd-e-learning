import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import teamService from "../../../../../lib/team";
import userService from "../../../../../lib/user";
import { notFoundError, unauthorizedError } from "../../../../../utils/errors";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    if (!authUser) {
      unauthorizedError("Your are unauthorized for this action");
    }

    // Validate incoming body data with defined schema
    const validatedData = requiredIdSchema.parse(req.params);

    // get user team info
    const userTeamInfo = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    if (
      authUser?.role !== "superadmin" &&
      userTeamInfo?.team_members?.team_id !== validatedData.id
    ) {
      unauthorizedError(
        "Your are not a member of this team to perform this action"
      );
    }

    //get single item with validated id
    const data = await teamService.getSingle(validatedData);

    if (!data) {
      notFoundError("User not found!");
    }

    const responseData = {
      success: true,
      message: "Get team details successfully!",
      data: data,
    };

    //send success response
    return res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getTeamMember };
