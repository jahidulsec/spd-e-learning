import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import topicService from "../../../../../lib/e-detailing";
import userService from "../../../../../lib/user";
import {
  forbiddenError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";
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
    const data = await topicService.getSingle(validatedData);

    if (!data) {
      notFoundError("E-detailing topic not found!");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "e_detailing",
      "delete",
      data as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    const deleted: any = await topicService.deleteOne(validatedData);

    if (deleted == 0) {
      serverError("E-detailing topic is not deleted");
    }

    const responseData = {
      success: true,
      message: "E-detailing topic is deleted successfully!",
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

export { del as delTopic };
