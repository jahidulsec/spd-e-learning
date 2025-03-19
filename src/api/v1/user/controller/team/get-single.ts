import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import userService from "../../../../../lib/team";
import { notFoundError, unauthorizedError } from "../../../../../utils/errors";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    // const authUser = req.user;

    // if (!authUser) {
    //   unauthorizedError("Your are unauthorized for this action");
    // }

    // Validate incoming body data with defined schema
    const validatedData = requiredIdSchema.parse(req.params);

    //get single item with validated id
    const data = await userService.getSingle(validatedData);

    if (!data) {
      notFoundError("User not found!");
    }

    const responseData = {
      success: true,
      message: "Get team details successfully!",
      data: data,
    };

    //send success response
    return res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getTeam };
