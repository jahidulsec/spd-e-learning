import { Request, Response, NextFunction } from "express-serve-static-core";
import { createQuizDTOSchema } from "../../../../../schemas/quiz";
import userService from "../../../../../lib/user";
import quizSerive from "../../../../../lib/quiz";
import { badRequestError, forbiddenError } from "../../../../../utils/errors";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createQuizDTOSchema.parse(formData);

    // if not superuser, add team id from user info
    if (user?.role !== "superadmin") {
      // only superadmin can archive
      validatedData.is_archived = false;

      if (
        user?.team_members.filter(
          (item) => item.team_id === validatedData.team_id
        ).length === 0
      ) {
        forbiddenError("You do not have access for this team");
      }
    }

    // check start date and end date validation
    if (validatedData.start_date > validatedData.end_date) {
      badRequestError("Start date must be less than end date");
    }

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
