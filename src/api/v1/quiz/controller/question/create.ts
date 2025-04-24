import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createQuestionDTOSchema } from "../../../../../schemas/question";
import questionService from "../../../../../lib/question";
import quizService from "../../../../../lib/quiz";
import { forbiddenError, notFoundError } from "../../../../../utils/errors";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createQuestionDTOSchema.parse(formData);

    // get quiz
    const quiz = await quizService.getSingle({
      id: validatedData.quiz_id,
    });

    if (!quiz.data) {
      notFoundError("Quiz not found");
    }

    // if not superuser, add team id from user info
    if (user?.role !== "superadmin") {
      if (
        user?.team_members.filter((item) => item.team_id === quiz.data?.team_id)
          .length === 0
      ) {
        forbiddenError("You do not have access for this team");
      }
    }

    //create new with validated data
    const created = await questionService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New File created successfully!",
      data: {
        ...created,
      },
    };

    //send success response
    res.status(201).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { create as createQuestion };
