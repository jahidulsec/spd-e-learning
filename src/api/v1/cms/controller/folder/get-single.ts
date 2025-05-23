import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import cmsService from "../../../../../lib/folder";
import { forbiddenError, notFoundError } from "../../../../../utils/errors";
import userService from "../../../../../lib/user";
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
    const data = await cmsService.getSingleWithTeamInfo(validatedData);

    if (!data) {
      notFoundError("Folder not found!");
      return;
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "folders",
      "view",
      data as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    // extract category info
    const { category, file, ...restData } = data;

    const responseData = {
      success: true,
      message: "Get folder details successfully!",
      data: {
        ...restData,
        file: file.map((item) => {
          return {
            ...item,
            file_path: `${req.protocol}://${req.get("host")}/uploads/files/${
              item.filename
            }`,
          };
        }),
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

export { get as getFolder };
