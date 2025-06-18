import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/team";
import { paginate } from "../../../../../utils/pagination";
import { teamQuerySchema } from "../../../../../schemas/team";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = teamQuerySchema.parse(req.query);

    //get all items with validated queries
    const { data, count } = await userService.getStats(validatedData);

    const responseData = {
      success: true,
      message: "All teams stats get successfully!",
      data: data.map((item) => {
        const { _count, ...rest } = item;
        return {
          ...rest,
          team_members: _count.team_members,
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

export { get as getTeamStats };
