import { Request, Response, NextFunction } from "express-serve-static-core";
import { quizQuerySchema } from "../../../../../schemas/quiz";
import quizService from "../../../../../lib/quiz";
import { paginate } from "../../../../../utils/pagination";
import userService from "../../../../../lib/user";
import { $Enums } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    // validate incoming body data with defined schema
    const validatedData = quizQuerySchema.parse(req.query);

    let responseData: any;

    if (
      (["superadmin", "director"] as $Enums.role[]).includes(
        user?.role as $Enums.role
      )
    ) {
      //get all items with validated queries
      const { data, count } = await quizService.getMulti(validatedData);

      responseData = {
        success: true,
        message: "All Quizzes get successfully!",
        data: data,
        pagination: {
          ...paginate(validatedData.page, validatedData.size, count),
        },
      };
    } else {
      const { data, count } = await quizService.getMultiByTeamId(
        user?.team_members?.team_id as string,
        validatedData
      );
      
      responseData = {
        success: true,
        message: "All Quizzes get successfully!",
        data: data,
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

export { get as getQuizzes };
