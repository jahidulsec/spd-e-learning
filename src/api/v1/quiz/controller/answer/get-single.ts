import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import userService from "../../../../../lib/user";
import questionService from "../../../../../lib/question";
import { forbiddenError, notFoundError } from "../../../../../utils/errors";
import { hasPermission, User } from "../../../../../policy/policy";
import db from "../../../../../db/db";
import { result } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    //Validate incoming body data with defined schema
    const validatedData = requiredIdSchema.parse(req.params);

    //get single item with validated id
    const data = await questionService.getSingle(validatedData);

    if (!data) {
      notFoundError("question not found!");
      return;
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "question",
      "view",
      data as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    let quizResult: result[] = [];

    // get mio submitted answer
    if (authUser?.role === "mios") {
      quizResult = await db.result.findMany({
        where: {
          answer: {
            question_id: validatedData.id,
          },
          team_member_id: authUser.teamMemberId,
        },
      });
    }

    const { quiz, ...rest } = data;

    const responseData = {
      success: true,
      message: "Get question details successfully!",
      data: rest,
      ...(quizResult.length > 0 && {
        answer: quizResult[0],
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

export { get as getAnswer };
