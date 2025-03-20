import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import teamService from "../../../../../lib/team-member";
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

    let data: any;

    // if team member - then get only team member info
    if (authUser?.role !== "superadmin") {
      //get single item with validated id
      data = await teamService.getSingleByTeamId(
        validatedData.id,
        userTeamInfo?.team_members?.team_id ?? "0"
      );
    } else {
      // super admin can get all team member
      //get single item with validated id
      data = await teamService.getSingle(validatedData);
    }

    if (!data) {
      notFoundError("User not found!");
    }

    const responseData = {
      success: true,
      message: "Get team details successfully!",
      data: data,
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getTeamMember };
