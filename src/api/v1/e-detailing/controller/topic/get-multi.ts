import { Request, Response, NextFunction } from "express-serve-static-core";
import { eDetailingQuerySchema } from "../../../../../schemas/e-detailing";
import cmsService from "../../../../../lib/e-detailing";
import { paginate } from "../../../../../utils/pagination";
import { $Enums } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // validate incoming body data with defined schema
    const validatedData = eDetailingQuerySchema.parse(req.query);

    let responseData: any;

    if (
      (["superadmin", "director"] as $Enums.role[]).includes(
        authUser?.role as $Enums.role
      )
    ) {
      //get all items with validated queries
      const { data, count } = await cmsService.getMulti(validatedData);

      responseData = {
        success: true,
        message: "All e-detailing topics get successfully!",
        data: data,
        pagination: {
          ...paginate(validatedData.page, validatedData.size, count),
        },
      };
    } else {
      const { data, count } = await cmsService.getMultiByUserId(
        authUser?.id as string,
        validatedData
      );

      responseData = {
        success: true,
        message: "All e-detailing topics get successfully!",
        data: data.map((item) => {
          const { e_detailing_video, ...modifiedData } = item;

          return {
            ...modifiedData,
            ...(authUser?.role === "mios" && {
              participated: e_detailing_video.length > 0,
            }),
          };
        }),
        pagination: {
          ...paginate(validatedData.page, validatedData.size, count),
        },
      };
    }

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getTopics };
