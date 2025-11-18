import { Request, Response, NextFunction } from "express-serve-static-core";
import { createNotificationUserDTOSchema } from "../../../../../schemas/notification-user";
import notificationUserService from "../../../../../lib/notification-user";
import { forbiddenError } from "../../../../../utils/errors";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createNotificationUserDTOSchema.parse(formData);

    if (validatedData.user_id !== authUser?.id) {
      forbiddenError("You are not permitted")
    }

    //create new with validated data
    const created = await notificationUserService.createNew(validatedData);

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
