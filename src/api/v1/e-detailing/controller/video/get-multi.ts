import { Request, Response, NextFunction } from "express-serve-static-core";
import { paginate } from "../../../../../utils/pagination";
import { eVdieoQuerySchema } from "../../../../../schemas/e-video";
import cmsService from "../../../../../lib/e-video";
import { $Enums } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // validate incoming body data with defined schema
    const validatedData = eVdieoQuerySchema.parse(req.query);

    // authorization section
    let data: any[] = [];
    let count: number = 0;

    if (
      (["superadmin", "director"] as $Enums.role[]).includes(
        authUser?.role as $Enums.role
      )
    ) {
      //get all items with validated queries
      const result = await cmsService.getMulti(validatedData);

      data = result.data;
      count = result.count;
    } else if (authUser?.role === "team_lead") {
      const result = await cmsService.getMultiByTeamId(
        validatedData.team_id as string,
        validatedData
      );

      data = result.data;
      count = result.count;
    } else {
      const result = await cmsService.getMultiByUserId(
        authUser?.id as string,
        validatedData
      );

      data = result.data;
      count = result.count;
    }

    const responseData = {
      success: true,
      message: "All e-detailing video get successfully!",
      data: data.map((item) => {
        return {
          ...item,
          file_url: `${req.protocol}://${req.get("host")}/uploads/files/${
            item?.filename
          }`,
        };
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

export { get as getVideos };
