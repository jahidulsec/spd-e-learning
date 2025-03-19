import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateTeamDTOSchema } from "../../../../../schemas/team";
import teamService from "../../../../../lib/team";
import userService from "../../../../../lib/user";
import {
  notFoundError,
  serverError,
  unauthorizedError,
} from "../../../../../utils/errors";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    if (!authUser) {
      unauthorizedError("Your are unauthorized for this action");
    }

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    // get user team info
    const userTeamInfo = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    // check authorization
    if (
      authUser?.role !== "superadmin" &&
      userTeamInfo?.team_members?.team_id !== validatedId.id
    ) {
      unauthorizedError(
        "Your are not a member of this team to perform this action"
      );
    }

    // Validate incoming body data with defined schema
    const formData = req.body;

    const validatedData = updateTeamDTOSchema.parse(formData);

    //check existing Team
    const existingTeam = await teamService.getSingle(validatedId);

    if (!existingTeam) {
      //send not found error if not exist
      notFoundError("Team does not found");
    }

    //update with validated data
    const updated = await teamService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Team not updated");
    }

    const responseData = {
      success: true,
      message: "Team updated successfully!",
      data: updated,
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { update as updateTeam };
