import { Request, Response, NextFunction } from "express-serve-static-core";
import { paginate } from "../../../../../utils/pagination";
import userService from "../../../../../lib/user";
import { questionQuerySchema } from "../../../../../schemas/question";
import questionService from "../../../../../lib/question";
import { $Enums } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // validate incoming body data with defined schema
    const validatedData = questionQuerySchema.parse(req.query);

    // authorization section
    let data: any[] = [];
    let count: number = 0;

    if (
      (["superadmin", "director"] as $Enums.role[]).includes(
        authUser?.role as $Enums.role
      )
    ) {
      //get all items with validated queries
      const result = await questionService.getMulti(validatedData);

      data = result.data;
      count = result.count;
    } else {
      const result = await questionService.getMultiByUserId(
        authUser?.id as string,
        validatedData
      );

      data = result.data;
      count = result.count;
    }

    const responseData = {
      success: true,
      message: "All questions get successfully!",
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

export { get as getQuestions };
