import { Request, Response, NextFunction } from "express-serve-static-core";
import { paginate } from "../../../../../utils/pagination";
import { forbiddenError, notFoundError } from "../../../../../utils/errors";
import userService from "../../../../../lib/user";
import quizService from "../../../../../lib/quiz";
import { quizQuerySchema } from "../../../../../schemas/quiz";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = quizQuerySchema.parse(req.query);

    // get auth user
    const authUser = req.user;

    // get quiz id
    const { quizId } = req.params;

    // get quiz info
    const quiz = await quizService.getSingle({ id: quizId });

    if (!quiz.data) {
      notFoundError("Quiz not found");
    }

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    if (
      authUser?.role === "team_lead" &&
      user?.team_members.filter((item) => item.team_id === quiz.data?.team_id)
        .length === 0
    ) {
      forbiddenError("You are not permitted for this team action");
    }

    //get all items with validated queries
    const { data, count } = await quizService.getQuizUserResult(quizId, validatedData);

    const responseData = {
      success: true,
      message: "All quiz member leaderboard get successfully!",
      data: data.map((item) => {
        return {
          sap_id: item.team_member.user_id,
          full_name: item.team_member.user.full_name,
          total_marks: item.quiz._count.question,
          score: item.quiz.question.reduce(
            (sum, value) => sum + Number(value?.result?.score),
            0
          ),
        };
      }),
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

export { get as getQuizLeaderboard };
