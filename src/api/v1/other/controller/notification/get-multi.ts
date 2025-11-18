import { Request, Response, NextFunction } from "express-serve-static-core";
import { NotificationQuerySchema } from "../../../../../schemas/notification";
import cmsService from "../../../../../lib/notification";
import { paginate } from "../../../../../utils/pagination";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    console.log(authUser)

    // validate incoming body data with defined schema
    const validatedData = NotificationQuerySchema.parse(req.query);

    validatedData.user_id = authUser?.id ?? ''


    //get all items with validated queries
    const { data, count } = await cmsService.getMulti(validatedData);

    const responseData = {
      success: true,
      message: "All notifications get successfully!",
      data: data.map(item => {
        const { notification_user, ...rest } = item

        return {
          ...rest, marked: notification_user.length > 0
        }
      }),
      pagination: {
        ...paginate(validatedData.page, validatedData.size, count),
      },
    };


    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getNotifications };
