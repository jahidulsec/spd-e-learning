import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { usersQuerySchema } from "../../../../../schemas/user";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = usersQuerySchema.parse(req.query);

    //get all items with validated queries
    const { data } = await userService.getUserStats();

    const responseData = {
      success: true,
      message: "Users statstistics get successfully!",
      data: data.map((item) => {
        return {
          role: item.role,
          count: item._count.sap_id,
        };
      }),
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getUserStats };
