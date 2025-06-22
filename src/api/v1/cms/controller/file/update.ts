import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateFileDTOSchema } from "../../../../../schemas/file";
import cmsService from "../../../../../lib/file";
import {
  forbiddenError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";
import upload from "../../../../../utils/upload";
import deleteImage from "../../../../../utils/delete-image";
import { hasPermission, User } from "../../../../../policy/policy";
import userService from "../../../../../lib/user";

const update = async (req: Request, res: Response, next: NextFunction) => {
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

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    //Validate incoming body data with defined schema
    const validatedData = updateFileDTOSchema.parse(formData);

    //check existing File
    const existingFile = await cmsService.getSingle(validatedId);

    if (!existingFile) {
      //send not found error if not exist
      notFoundError("File does not found");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "files",
      "update",
      existingFile as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    // only superadmin can archived
    if (
      authUser?.role !== "superadmin" &&
      validatedData.is_archived !== undefined
    ) {
      validatedData.is_archived = false;
    }

    // if upload new file
    if (uploadedFile) {
      // get filename and file type
      formData["filename"] = uploadedFile.filename;
      formData["file_type"] = uploadedFile.mimeType;

      // delete previous file
      deleteImage({ folder: "files", image: existingFile?.filename || "" });
    }

    //update with validated data
    const updated = await cmsService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("File not updated");
    }

    const responseData = {
      success: true,
      message: "File updated successfully!",
      data: {
        ...updated,
        file_path: `${req.protocol}://${req.get("host")}/uploads/files/${
          updated.filename
        }`,
      },
    };

    //send success response
    res.status(200).json(responseData);
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

export { update as updateFile };
