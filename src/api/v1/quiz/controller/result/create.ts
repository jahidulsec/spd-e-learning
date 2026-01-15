import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createResultDTOSchema } from "../../../../../schemas/result";
import cmsService from "../../../../../lib/result";
import optionService from "../../../../../lib/option";
import { conflictError, notFoundError } from "../../../../../utils/errors";

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
    const validatedData = createResultDTOSchema.parse(formData);

    // get option
    const option = await optionService.getSingleWithTeamInfo({
      id: validatedData.answer_id,
    });

    // check team permission
    if (
      user?.team_members.filter(
        (item) => item.team_id === option?.question.quiz.team_id
      ).length === 0
    ) {
      notFoundError("Quiz does not exist");
    }

    // set team member id
    validatedData.team_member_id = user?.team_members.filter(
      (item) => item.team_id === option?.question.quiz.team_id
    )?.[0].id;

    // set question id
    validatedData.question_id = option?.question_id;

    // get score
    if (option?.is_correct) {
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
