import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateQuestionDTOSchema } from "../../../../../schemas/question";
import questionService from "../../../../../lib/question";
import {
  forbiddenError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";
import { hasPermission, User } from "../../../../../policy/policy";
import userService from "../../../../../lib/user";

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
    const validatedData = updateQuestionDTOSchema.parse(formData);

    //check existing Question
    const existingQuestion = await questionService.getSingle(validatedId);

    if (!existingQuestion) {
      //send not found error if not exist
      notFoundError("Question does not found");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "question",
      "update",
      existingQuestion as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    //update with validated data
    const updated = await questionService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Question not updated");
    }

    const responseData = {
      success: true,
      message: "Question updated successfully!",
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

export { update as updateQuestion };
