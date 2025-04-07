import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import userService from "../../../../../lib/user";
import cmsService from "../../../../../lib/file";
import { notFoundError, unauthorizedError } from "../../../../../utils/errors";
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
    const data = await cmsService.getSingle(validatedData);

    if (!data) {
      notFoundError("File not found!");
      return;
    }

    const {sub_folder, ...newData} = data

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "files",
      "view",
      data as any
    );

    if (!isPermitted) {
      unauthorizedError(`You are unauthorized for this action`);
    }

    const responseData = {
      success: true,
      message: "Get file details successfully!",
      data: {
        ...newData,
        file_path: `${req.protocol}://${req.get("host")}/uploads/files/${
          data?.filename
        }`,
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

export { get as getFile };
