import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createFileDTOSchema } from "../../../../../schemas/file";
import cmsService from "../../../../../lib/file";
import folderService from "../../../../../lib/folder";
import upload from "../../../../../utils/upload";
import { badRequestError, notFoundError } from "../../../../../utils/errors";
import deleteImage from "../../../../../utils/delete-image";

const create = async (req: Request, res: Response, next: NextFunction) => {
  let uploadedFile: any | null = "";

  try {
    uploadedFile = await upload.uploadPhoto(req, res, "file");

    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    if (!uploadedFile) {
      badRequestError("file field required");
    }

    // get filename and file type
    formData["filename"] = uploadedFile.filename;
    formData["file_type"] = uploadedFile.mimeType;

    //Validate incoming body data with defined schema
    const validatedData = createFileDTOSchema.parse(formData);

    // get folder
    const folder = await folderService.getSingleWithTeamInfo({
      id: validatedData.folder_id,
    });

    // if not superuser, add team id from user info
    if (user?.role !== "superadmin") {
      if (folder?.category.team_id !== user?.team_members?.team_id) {
        notFoundError("Folder does not exist");
      }
    }

    //create new with validated data
    const created = await cmsService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New File created successfully!",
      data: {
        ...created,
        file_path: `${req.protocol}://${req.get("host")}/uploads/files/${
          created.filename
        }`,
      },
    };

    //send success response
    res.status(201).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //delete uploaded photo is item isn't created
    if (uploadedFile) {
      deleteImage({ folder: "files", image: uploadedFile.filename || "" });
    }

    //send error response
    next(error);
  }
};

export { create as createFile };
