import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateQuizDTOSchema } from "../../../../../schemas/quiz";
import userService from "../../../../../lib/user";
import quizService from "../../../../../lib/quiz";
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
    const validatedData = updateQuizDTOSchema.parse(formData);

    //check existing Quiz
    const existingQuiz = await quizService.getSingle(validatedId);

    if (!existingQuiz) {
      //send not found error if not exist
      notFoundError("Quiz does not found");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "quiz",
      "update",
      existingQuiz.data as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    //update with validated data
    const updated = await quizService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Quiz not updated");
    }

    const responseData = {
      success: true,
      message: "Quiz updated successfully!",
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

export { update as updateQuiz };
