import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateFolderDTOSchema } from "../../../../../schemas/folder";
import cmsService from "../../../../../lib/folder";
import { notFoundError, serverError, unauthorizedError } from "../../../../../utils/errors";
import userService from "../../../../../lib/user";
import { hasPermission, User } from "../../../../../policy/policy";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    //Validate incoming body data with defined schema
    const validatedData = updateFolderDTOSchema.parse(formData);

    //check existing Folder
    const existingFolder = await cmsService.getSingleWithTeamInfo(validatedId);

    if (!existingFolder) {
      //send not found error if not exist
      notFoundError("Folder does not found");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "folders",
      'update',
      existingFolder as any
    );

    if (!isPermitted) {
      unauthorizedError(`You are unauthorized for this action`);
    }

    //update with validated data
    const updated = await cmsService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Folder not updated");
    }

    const responseData = {
      success: true,
      message: "Folder updated successfully!",
      data: updated,
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { update as updateFolder };
