import { Request, Response, NextFunction } from "express-serve-static-core";
import { paginate } from "../../../../../utils/pagination";
import userService from "../../../../../lib/user";
import { resultQuerySchema } from "../../../../../schemas/result";
import cmsService from "../../../../../lib/result";
import { $Enums, file } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    // validate incoming body data with defined schema
    const validatedData = resultQuerySchema.parse(req.query);

    // authorization section
    let data: any[] = [];
    let count: number = 0;

    if (
      (["superadmin", "director"] as $Enums.role[]).includes(
        user?.role as $Enums.role
      )
    ) {
      //get all items with validated queries
      const result = await cmsService.getMulti(validatedData);

      data = result.data;
      count = result.count;
    } else {
      const result = await cmsService.getMultiByTeamId(
        user?.team_members?.team_id as string,
        validatedData
      );

      data = result.data;
      count = result.count;
    }


    const responseData = {
      success: true,
      message: "All quiz results get successfully!",
      data: data,
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

export { get as getResults };
