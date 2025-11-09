import { Request, Response, NextFunction } from "express-serve-static-core";
import analyticsService from "../../../../../lib/leaderboard";
import { LeaderboardQuerySchema } from "../../../../../schemas/leaderboard";
import { paginate } from "../../../../../utils/pagination";


const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = LeaderboardQuerySchema.parse(req.query);

    //get all items with validated queries
    const data = await analyticsService.getMulti(validatedData)

    const serialized = data.data.map(r =>
      Object.fromEntries(
        Object.entries(r).map(([k, v]) => [k, typeof v === 'bigint' ? Number(v) : v])
      )
    );

    const responseData = {
      success: true,
      message: "Leaderboard get successfully!",


      data: serialized,
      pagination: {
        ...paginate(
          validatedData.page,
          validatedData.size,
          Number(data.data?.[0].total_count ?? 0)
        ),
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

export { get as getLeaderboard };
