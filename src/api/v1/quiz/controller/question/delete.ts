import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import userService from "../../../../../lib/user";
import questionService from "../../../../../lib/question";
import { forbiddenError, notFoundError, serverError } from "../../../../../utils/errors";
import { hasPermission, User } from "../../../../../policy/policy";

const del = async (req: Request, res: Response, next: NextFunction) => {
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
    const data = await questionService.getSingle(validatedData);

    if (!data) {
      notFoundError("Question not found!");
      return
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "question",
      "delete",
      data as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    const deleted: any = await questionService.deleteOne(validatedData);

    if (deleted == 0) {
      serverError("Question is not deleted");
    }

    const {quiz, ...rest} = data

    const responseData = {
      success: true,
      message: "Question is deleted successfully!",
      data: rest,
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { del as delQuestion };
