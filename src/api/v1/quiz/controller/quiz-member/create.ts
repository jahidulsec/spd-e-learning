import { Request, Response, NextFunction } from "express-serve-static-core";
import { createQuizMemberDTOSchema } from "../../../../../schemas/quiz-member";
import userService from "../../../../../lib/user";
import quizSerive from "../../../../../lib/quiz";
import quizMemberSerive from "../../../../../lib/quiz-member";
import { badRequestError } from "../../../../../utils/errors";

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
    const validatedData = createQuizMemberDTOSchema.parse(formData);

    // check team permission
    const quiz = await quizSerive.getSingle({ id: validatedData.quiz_id });

    // get team id from team member id
    const teamInfo = user?.team_members.filter(
      (item) => item.team_id === validatedData.team_id
    );

    if (validatedData.team_id !== quiz.data?.team_id) {
      badRequestError("Your are not permitted to perticipate this quiz");
    }

    // set team member id
    validatedData.team_member_id = teamInfo?.[0].id ?? ""

    //create new with validated data
    const created = await quizMemberSerive.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New quiz member created successfully!",
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

export { create as createQuizMember };
