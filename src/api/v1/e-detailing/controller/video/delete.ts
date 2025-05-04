import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import userService from "../../../../../lib/user";
import videoService from "../../../../../lib/e-video";
import {
  forbiddenError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";
import deleteImage from "../../../../../utils/delete-image";
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
    const data = await videoService.getSingle(validatedData);

    if (!data) {
      notFoundError("E detailing video not found!");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "e_detailing_video",
      "delete",
      data as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    const deleted: any = await videoService.deleteOne(validatedData);

    if (deleted == 0) {
      serverError("Result is not deleted");
    }

    // delete previous file
    if (data) {
      deleteImage({ folder: "files", image: data.filename });
    }

    const responseData = {
      success: true,
      message: "Video is deleted successfully!",
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

export { del as delVideo };
