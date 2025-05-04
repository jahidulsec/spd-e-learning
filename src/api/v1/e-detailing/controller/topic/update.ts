import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateEDetailingDTOSchema } from "../../../../../schemas/e-detailing";
import userService from "../../../../../lib/user";
import cmsService from "../../../../../lib/e-detailing";
import {
  forbiddenError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";
import { hasPermission, User } from "../../../../../policy/policy";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    //Validate incoming body data with defined schema
    const validatedData = updateEDetailingDTOSchema.parse(formData);

    //check existing EDetailingTopic
    const existingEDetailingTopic = await cmsService.getSingle(validatedId);

    if (!existingEDetailingTopic) {
      //send not found error if not exist
      notFoundError("E-DetailingT opic does not found");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "e_detailing",
      "update",
      existingEDetailingTopic as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    //update with validated data
    const updated = await cmsService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("e-detailing topic not updated");
    }

    const responseData = {
      success: true,
      message: "e-detailing topic updated successfully!",
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

export { update as updateTopic };
