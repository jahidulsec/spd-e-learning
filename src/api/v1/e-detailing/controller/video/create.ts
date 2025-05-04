import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createEVdieoDTOSchema } from "../../../../../schemas/e-video";
import cmsService from "../../../../../lib/e-video";
import topicService from "../../../../../lib/e-detailing";
import {
  badRequestError,
  notFoundError,
} from "../../../../../utils/errors";
import upload from "../../../../../utils/upload";
import deleteImage from "../../../../../utils/delete-image";

const create = async (req: Request, res: Response, next: NextFunction) => {
  let uploadedFile: any | null = "";

  try {
    uploadedFile = await upload.uploadPhoto(req, res, "video");

    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    if (!uploadedFile) {
      badRequestError("video field required");
    }

    // set filename
    formData['filename'] = uploadedFile.filename

    //Validate incoming body data with defined schema
    const validatedData = createEVdieoDTOSchema.parse(formData);

    // get topic
    const topic = await topicService.getSingle({
      id: validatedData.e_detailing_id,
    });

    // check team permission
    if (
      user?.team_members.filter((item) => item.team_id === topic?.team_id)
        .length === 0
    ) {
      notFoundError("Topic does not exist");
    }

    // set team member id
    validatedData.team_member_id = user?.team_members.filter(
      (item) => item.team_id === topic?.team_id
    )?.[0].id;

  
    //create new with validated data
    const created = await cmsService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New e detailing video submitted successfully!",
      data: created,
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

export { create as createVideo };
