import { Request, Response, NextFunction } from "express-serve-static-core";
import { eScoreQuerySchema } from "../../../../../schemas/e-score";
import cmsService from "../../../../../lib/e-score";
import { paginate } from "../../../../../utils/pagination";
import { $Enums } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // validate incoming body data with defined schema
    const validatedData = eScoreQuerySchema.parse(req.query);

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
        message: "All e-detailing Scores get successfully!",
        data: data.map((item) => {
          return {
            ...item,
            file_url: `${req.protocol}://${req.get("host")}/uploads/files/${
              item.e_detailing_video.filename
            }`,
          };
        }),
        pagination: {
          ...paginate(validatedData.page, validatedData.size, count),
        },
      };
    } else if (authUser?.role === "team_lead") {
      const { data, count } = await cmsService.getMultiByTeamId(
        validatedData.team_id as string,
        validatedData
      );

      responseData = {
        success: true,
        message: "All e-detailing Scores get successfully!",
        data: data.map((item) => {
          return {
            ...item,
            file_url: `${req.protocol}://${req.get("host")}/uploads/files/${
              item.e_detailing_video.filename
            }`,
          };
        }),
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
        message: "All e-detailing Scores get successfully!",
        data: data.map((item) => {
          return {
            ...item,
            file_url: `${req.protocol}://${req.get("host")}/uploads/files/${
              item.e_detailing_video.filename
            }`,
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

export { get as getScores };
