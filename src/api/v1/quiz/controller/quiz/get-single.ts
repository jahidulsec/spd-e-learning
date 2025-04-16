import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import userService from "../../../../../lib/user";
import quizService from "../../../../../lib/quiz";
import { forbiddenError, notFoundError } from "../../../../../utils/errors";
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
    const validatedData = requiredIdSchema.parse(req.params);

    //get single item with validated id
    const data = await quizService.getSingle(validatedData);

    if (!data.data) {
      notFoundError("Quiz not found!");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "quiz",
      "view",
      data as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    const responseData = {
      success: true,
      message: "Get Quiz details successfully!",
      data: { ...data.data, duration_m: data.duration },
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getQuiz };
