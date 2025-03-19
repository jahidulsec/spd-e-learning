import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/team";
import { paginate } from "../../../../../utils/pagination";
import { teamQuerySchema } from "../../../../../schemas/team";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = teamQuerySchema.parse(req.query);

    //get all items with validated queries
    const { data, count } = await userService.getMulti(validatedData);

    const responseData = {
      success: true,
      message: "All teams get successfully!",
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

export { get as getTeams };
