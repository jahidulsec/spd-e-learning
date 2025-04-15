import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createFolderDTOSchema } from "../../../../../schemas/folder";
import cmsService from "../../../../../lib/folder";
import categoryService from "../../../../../lib/category";
import { badRequestError, notFoundError } from "../../../../../utils/errors";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    // check parent folder id
    if (formData["parent_folder_id"]) {
      const parentFolder = await cmsService.getSingleWithTeamInfo({
        id: formData["parent_folder_id"],
      });

      // if not superuser, add team id from user info
      if (user?.role !== "superadmin") {
        if (parentFolder?.category?.team_id !== user?.team_members?.team_id) {
          notFoundError("Category does not exist");
        }
      }

      formData["category_id"] = parentFolder?.category_id
    }

    //Validate incoming body data with defined schema
    const validatedData = createFolderDTOSchema.parse(formData);

    //create new with validated data
    const created = await cmsService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New folder created successfully!",
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

export { create as createFolder };
