import { Request, Response, NextFunction } from "express-serve-static-core";
import { createNotificationDTOSchema } from "../../../../../schemas/notification";
import userService from "../../../../../lib/user";
import cmsService from "../../../../../lib/notification";
import { forbiddenError } from "../../../../../utils/errors";

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
    const validatedData = createNotificationDTOSchema.parse(formData);

    // only team lead can create notification
    if (user?.team_members.filter(item => item.team_id === validatedData.team_id).length === 0) {
      forbiddenError("You are not permitted for this team action")
    }


    //create new with validated data
    const created = await cmsService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New notification user created successfully!",
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

export { create as createNotificationUser };
