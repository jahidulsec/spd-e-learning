import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateQuizMemberDTOSchema } from "../../../../../schemas/quiz-member";
import quizService from "../../../../../lib/quiz-member";
import {
  badRequestError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    const authUser = req.user;

    //validate incoming params id
    const { quizId } = (req.params);

    // Validate incoming body data with defined schema
    const validatedData = updateQuizMemberDTOSchema.parse(formData);

    //check existing QuizMember
    const existingQuizMember = await quizService.getSingleByQuizUserId(quizId, authUser?.id ?? '');

    if (!existingQuizMember) {
      //send not found error if not exist
      notFoundError("Quiz Member does not found");
      return;
    }

    if (validatedData.end_at) {
      validatedData.duration_s = (validatedData.end_at.getTime() - existingQuizMember.created_at.getTime()) / 1000
    }

    //update with validated data
    const updated = await quizService.updateOne({ id: existingQuizMember.id }, validatedData);

    if (!updated) {
      serverError("Quiz member not updated");
    }

    const responseData = {
      success: true,
      message: "Quiz member updated successfully!",
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

export { update as updateQuizMember };
