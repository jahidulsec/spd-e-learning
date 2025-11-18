import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import cmsService from "../../../../../lib/notification";
import userService from "../../../../../lib/user";
import {
  forbiddenError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";

const del = async (req: Request, res: Response, next: NextFunction) => {
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
    const data = await cmsService.getSingle(validatedData);

    if (!data) {
      notFoundError("Category not found!");
    }


    // team lead can delete
    if (user?.team_members.filter(item => item.team_id === data?.team_id).length === 0) {
      forbiddenError("You are not permitted for this team action")
    }

    const deleted: any = await cmsService.deleteOne(validatedData);

    if (deleted == 0) {
      serverError("Notification is not deleted");
    }

    const responseData = {
      success: true,
      message: "Notification is deleted successfully!",
      data: data,
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { del as delNotification };
