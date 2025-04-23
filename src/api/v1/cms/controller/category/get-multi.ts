import { Request, Response, NextFunction } from "express-serve-static-core";
import { categoryQuerySchema } from "../../../../../schemas/category";
import cmsService from "../../../../../lib/category";
import { paginate } from "../../../../../utils/pagination";
import userService from "../../../../../lib/user";
import { $Enums } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;
    // validate incoming body data with defined schema
    const validatedData = categoryQuerySchema.parse(req.query);

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
        message: "All categories get successfully!",
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
        message: "All categories get successfully!",
        data: data,
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

export { get as getCategories };
