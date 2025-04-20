import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateResultDTOSchema } from "../../../../../schemas/result";
import cmsService from "../../../../../lib/result";
import {
  forbiddenError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";
import { hasPermission, User } from "../../../../../policy/policy";
import userService from "../../../../../lib/user";
import optionService from "../../../../../lib/option";

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
    const validatedData = updateResultDTOSchema.parse(formData);

    //check existing Result
    const existingResult = await cmsService.getSingle(validatedId);

    if (!existingResult) {
      //send not found error if not exist
      notFoundError("Result does not found");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "result",
      "update",
      existingResult as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    // update score
    if (validatedData.answer_id) {
      // get quiz
      const quiz = await optionService.getSingle({
        id: validatedData.answer_id,
      });

      // set score
      if (quiz?.is_correct) {
        validatedData.score = 1;
      } else {
        validatedData.score = 0;
      }
    }

    //update with validated data
    const updated = await cmsService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Result not updated");
    }

    const responseData = {
      success: true,
      message: "Result updated successfully!",
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

export { update as updateResult };
