import { Request, Response, NextFunction } from "express-serve-static-core";
import quaterService from "../../../../../lib/quater";
import { paginate } from "../../../../../utils/pagination";
import { quaterQuerySchema } from "../../../../../schemas/quater";
import { badRequestError, forbiddenError } from "../../../../../utils/errors";
import userService from "../../../../../lib/user";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get team id
    const { teamId } = req.params;


    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    if (
      authUser?.role === "team_lead" &&
      user?.team_members.filter((item) => item.team_id === teamId).length === 0
    ) {
      forbiddenError("You are not permitted for this team action");
    }
    // validate incoming body data with defined schema
    const validatedData = quaterQuerySchema.parse(req.query);

    //get all items with validated queries
    const { data, count } = await quaterService.getMultiForTeams(
      validatedData,
      teamId
    );

    const responseData = {
      success: true,
      message: "All quaters get successfully!",
      data: data,
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

export { get as getQuatersTeams };
