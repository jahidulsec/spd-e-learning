import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createResultDTOSchema } from "../../../../../schemas/result";
import cmsService from "../../../../../lib/result";
import optionService from "../../../../../lib/option";
import {
  badRequestError,
  conflictError,
  notFoundError,
} from "../../../../../utils/errors";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    // set team member id
    // formData["team_member_id"] = user?.team_members?.id ?? "";

    //Validate incoming body data with defined schema
    const validatedData = createResultDTOSchema.parse(formData);

    // get quiz
    const quiz = await optionService.getSingleWithTeamInfo({
      id: validatedData.answer_id,
    });

    // check team permission
    // if (quiz?.question.quiz.team_id !== user?.team_members?.team_id) {
    //   notFoundError("Quiz does not exist");
    // }

    // set question id
    validatedData.question_id = quiz?.question_id;

    if (quiz?.result) {
      conflictError("You already submitted an answer");
    }

    // get score
    if (quiz?.is_correct) {
      validatedData.score = 1;
    }

    //create new with validated data
    const created = await cmsService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New answer created successfully!",
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

export { create as createResult };
