import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateTeamMemberDTOSchema } from "../../../../../schemas/team-member";
import teamService from "../../../../../lib/team-member";
import {
  notFoundError,
  serverError,
} from "../../../../../utils/errors";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    // Validate incoming body data with defined schema
    const formData = req.body;

    const validatedData = updateTeamMemberDTOSchema.parse(formData);

    //check existing TeamMember
    const existingTeamMember = await teamService.getSingle(validatedId);

    if (!existingTeamMember) {
      //send not found error if not exist
      notFoundError("Team member does not found");
    }

    //update with validated data
    const updated = await teamService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Team member not updated");
    }

    const responseData = {
      success: true,
      message: "Team member updated successfully!",
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

export { update as updateTeamMember };
