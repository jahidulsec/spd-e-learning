import { Request, Response, NextFunction } from "express-serve-static-core";
import { quizMemberQuerySchema } from "../../../../../schemas/quiz-member";
import quizService from "../../../../../lib/quiz-member";
import { paginate } from "../../../../../utils/pagination";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = quizMemberQuerySchema.parse(req.query);

    let responseData: any;

    const { data, count } = await quizService.getMulti(validatedData);

    responseData = {
      success: true,
      message: "Quiz members get successfully!",
      data: data,
      pagination: {
        ...paginate(validatedData.page, validatedData.size, count),
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

export { get as getQuizMembers };
