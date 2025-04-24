import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import questionService from "../../../../../lib/question";
import resultService from "../../../../../lib/result";
import {
  badRequestError,
  forbiddenError,
  notFoundError,
} from "../../../../../utils/errors";
import { hasPermission, User } from "../../../../../policy/policy";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    //Validate incoming body data with defined schema
    const { question_id, userId } = req.params;

    if (!question_id || !userId) {
      badRequestError("Please enter question and team member id");
    }

    //get single item with validated id
    const data = await questionService.getSingle({ id: question_id });

    if (!data) {
      notFoundError("question not found!");
      return;
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "question",
      "view",
      data as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    // get mio submitted answer
    const quizResult = await resultService.getSingleByUserId(
      userId as string,
      data.id as string
    );

    const { quiz, ...rest } = data;

    const responseData = {
      success: true,
      message: "Get question details successfully!",
      data: rest,
      ...(quizResult.length > 0 && {
        answer: quizResult[0],
      }),
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getQuestionAnswer };
