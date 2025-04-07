import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createSubFolderDTOSchema } from "../../../../../schemas/sub-folder";
import cmsService from "../../../../../lib/sub-folder";
import folderService from "../../../../../lib/folder";
import { notFoundError } from "../../../../../utils/errors";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createSubFolderDTOSchema.parse(formData);

    // get folder
    const folder = await folderService.getSingleWithTeamInfo({
      id: validatedData.folder_id,
    });

    // if not superuser, add team id from user info
    if (user?.role !== "superadmin") {
      if (folder?.category.team_id !== user?.team_members?.team_id) {
        notFoundError("Subfolder does not exist");
      }
    }

    //create new with validated data
    const created = await cmsService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New sub folder created successfully!",
      data: created,
    };

    //send success response
    res.status(201).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { create as createSubFolder };
