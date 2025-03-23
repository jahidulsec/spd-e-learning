import { Request, Response, NextFunction } from "express-serve-static-core";
import { folderQuerySchema } from "../../../../../schemas/folder";
import cmsService from "../../../../../lib/folder";
import userService from "../../../../../lib/user";
import { paginate } from "../../../../../utils/pagination";
import { $Enums } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    // validate incoming body data with defined schema
    const validatedData = folderQuerySchema.parse(req.query);

    let responseData: any;

    if (
      (["superadmin", "director"] as $Enums.role[]).includes(
        user?.role as $Enums.role
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
      const { data, count } = await cmsService.getMultiByTeamId(
        user?.team_members?.team_id as string,
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

    //get all items with validated queries
    const { data, count } = await cmsService.getMulti(validatedData);

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getFolders };
