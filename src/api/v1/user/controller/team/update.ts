import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateTeamDTOSchema } from "../../../../../schemas/team";
import cmsService from "../../../../../lib/team";
import {
  notFoundError,
  serverError,
  unauthorizedError,
} from "../../../../../utils/errors";
import { hashPassword } from "../../../../../utils/password";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    // const authUser = req.user;

    // if (!authUser) {
    //   unauthorizedError("Your are unauthorized for this action");
    // }

    const formData = req.body;

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    // Validate incoming body data with defined schema
    const validatedData = updateTeamDTOSchema.parse(formData);

    //check existing Team
    const existingTeam = await cmsService.getSingle(validatedId);

    if (!existingTeam) {
      //send not found error if not exist
      notFoundError("Team does not found");
    }

    //update with validated data
    const updated = await cmsService.updateOne(validatedId, validatedData);

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
