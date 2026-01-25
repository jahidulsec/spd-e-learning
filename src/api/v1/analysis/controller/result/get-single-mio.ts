import { Request, Response, NextFunction } from "express-serve-static-core";
import resultService from "../../../../../lib/result";
import { badRequestError } from "../../../../../utils/errors";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Validate incoming body data with defined schema
    const { userId } = req.params;

    // get team id
    const { team_id } = req.query;

    if (!team_id) {
      return badRequestError("Please enter team id");
    }

    // get mio submitted answer
    const { quizData, eDetailingData } =
      await resultService.getSingleMioAllByUserId(
        userId as string,
        team_id as string,
      );

    const responseData = {
      success: true,
      message: "Get MIO result overview successfully!",
      data: {
        quiz: quizData
          ? quizData.map((item) => {
              const { total_question, ...rest } = item;
              return {
                ...rest,
                total_question: Number(total_question),
              };
            })
          : [],
        e_detailing_data: eDetailingData,
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

export { get as getSingleMioAllResult };
