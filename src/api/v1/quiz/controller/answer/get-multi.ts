import { Request, Response, NextFunction } from "express-serve-static-core";
import { paginate } from "../../../../../utils/pagination";
import userService from "../../../../../lib/user";
import { quizQuerySchema } from "../../../../../schemas/quiz";
import quizService from "../../../../../lib/quiz";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get quiz id
    const { id } = req.params;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    // validate incoming body data with defined schema
    const validatedData = quizQuerySchema.parse(req.query);

    const data = await quizService.getSingleWithQuestionByTeamMemberId(
      id,
      authUser?.teamMemberId as string
    );

    const responseData = {
      success: true,
      message: "All questions get successfully!",
      data: data,
      pagination: {
        ...paginate(validatedData.page, validatedData.size, 0),
      },
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getQuestionAnswers };
