import { Request, Response, NextFunction } from "express-serve-static-core";
import performanceService from "../../../../../lib/performance";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //get all items with validated queries
    const { e_detailing_stats, quiz_stats } = await performanceService.getUserStats();

    const responseData = {
      success: true,
      message: "Team statstistics get successfully!",
      data: {
        e_detailing_stats: e_detailing_stats,
        quiz_stats: quiz_stats
      }
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getTeamStats };
