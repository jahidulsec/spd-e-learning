import { Request, Response, NextFunction } from "express-serve-static-core";
import { paginate } from "../../../../../utils/pagination";
import { forbiddenError, notFoundError } from "../../../../../utils/errors";
import userService from "../../../../../lib/user";
import eDetailingService from "../../../../../lib/e-detailing";
import { eDetailingQuerySchema } from "../../../../../schemas/e-detailing";
import { requiredIdSchema } from "../../../../../schemas/required-id";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = eDetailingQuerySchema.parse(req.query);

    //Validate incoming body data with defined schema
    const validatedId = requiredIdSchema.parse(req.params);

    // get auth user
    const authUser = req.user;

    // get eDetailing info
    const eDetailing = await eDetailingService.getSingle(validatedId);

    if (!eDetailing) {
      notFoundError("e Detailing not found");
    }

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    // check permission
    if (
      authUser?.role === "team_lead" &&
      user?.team_members.filter((item) => item.team_id === eDetailing?.team_id)
        .length === 0
    ) {
      forbiddenError("You are not permitted for this team action");
    }

    //get all items with validated queries
    const { data, count } = await eDetailingService.getUsersLeaderborad(
      validatedId.id,
      validatedData
    );

    const responseData = {
      success: true,
      message: "All quiz member leaderboard get successfully!",
      data: data.map((item) => {
        return {
          sap_id: item.e_detailing_video.team_member.user.sap_id,
          full_name: item.e_detailing_video.team_member.user.full_name,
          comment: item.comment,
          scored_by: item.scored_by,
          scored_by_name: item?.team_lead?.user.full_name,
          total_marks:
            Number(item.e_detailing_video.e_detailing.score_closing) +
            Number(item.e_detailing_video.e_detailing.score_content) +
            Number(item.e_detailing_video.e_detailing.score_presentation) +
            Number(item.e_detailing_video.e_detailing.score_starting),
          score:
            Number(item.score_closing) +
            Number(item.score_content) +
            Number(item.score_presentation) +
            Number(item.score_starting),
        };
      }),
      // data: data,
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

export { get as getEDetailingLeaderboard };
