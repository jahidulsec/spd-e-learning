import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import quizService from "../../../../../lib/option";
import {
  forbiddenError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";
import { hasPermission, User } from "../../../../../policy/policy";

const del = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Validate incoming body data with defined schema
    const validatedData = requiredIdSchema.parse(req.params);

    //get single item with validated id
    const data = await quizService.getSingle(validatedData);

    if (!data) {
      notFoundError("Option not found!");
    }

    const deleted: any = await quizService.deleteOne(validatedData);

    if (deleted == 0) {
      serverError("Option is not deleted");
    }

    const responseData = {
      success: true,
      message: "Option is deleted successfully!",
      data: data,
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { del as delOption };
