import { Request, Response, NextFunction } from "express-serve-static-core";
import { createQuizDTOSchema } from "../../../../../schemas/quiz";
import userService from "../../../../../lib/user";
import quizSerive from "../../../../../lib/quiz";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    // if not superuser, add team id from user info
    if (user?.role !== "superadmin") {
      formData["team_id"] = user?.team_members?.team_id;
    }

    //Validate incoming body data with defined schema
    const validatedData = createQuizDTOSchema.parse(formData);

    //create new with validated data
    const created = await quizSerive.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New quiz created successfully!",
      data: created,
    };

    //send success response
    res.status(201).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { create as createQuiz };
