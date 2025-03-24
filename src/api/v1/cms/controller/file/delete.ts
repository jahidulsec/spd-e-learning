import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import userService from "../../../../../lib/user";
import cmsService from "../../../../../lib/file";
import { notFoundError, serverError, unauthorizedError } from "../../../../../utils/errors";
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
    const data = await cmsService.getSingle(validatedData);

    if (!data) {
      notFoundError("File not found!");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "files",
      "delete",
      data as any
    );

    if (!isPermitted) {
      unauthorizedError(`You are unauthorized for this action`);
    }

    const deleted: any = await cmsService.deleteOne(validatedData);

    if (deleted == 0) {
      serverError("File is not deleted");
    }

    // delete previous file
    if (data?.filename) {
      deleteImage({ folder: "files", image: data.filename });
    }

    const responseData = {
      success: true,
      message: "File is deleted successfully!",
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

export { del as delFile };
