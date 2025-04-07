import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateSubFolderDTOSchema } from "../../../../../schemas/sub-folder";
import cmsService from "../../../../../lib/sub-folder";
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
    const validatedData = updateSubFolderDTOSchema.parse(formData);

    //check existing Folder
    const existingFolder = await cmsService.getSingleWithTeamInfo(validatedId);

    if (!existingFolder) {
      //send not found error if not exist
      notFoundError("Subfolder does not found");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "subfolders",
      'update',
      existingFolder as any
    );

    if (!isPermitted) {
      unauthorizedError(`You are unauthorized for this action`);
    }

    //update with validated data
    const updated = await cmsService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Subfolder not updated");
    }

    const responseData = {
      success: true,
      message: "Subfolder updated successfully!",
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

export { update as updateSubFolder };
