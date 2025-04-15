import { Request, Response, NextFunction } from "express-serve-static-core";
import quaterService from "../../../../../lib/quater";
import { paginate } from "../../../../../utils/pagination";
import { quaterQuerySchema } from "../../../../../schemas/quater";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = quaterQuerySchema.parse(req.query);

    //get all items with validated queries
    const { data, count } = await quaterService.getMulti(validatedData);

    const responseData = {
      success: true,
      message: "All quaters get successfully!",
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

export { get as getQuaters };
