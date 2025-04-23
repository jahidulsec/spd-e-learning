import { Request, Response, NextFunction } from "express-serve-static-core";
import teamMemberService from "../../../../../lib/team-member";
import userService from "../../../../../lib/user";
import { paginate } from "../../../../../utils/pagination";
import { teamQuerySchema } from "../../../../../schemas/team";
import { unauthorizedError } from "../../../../../utils/errors";
import { $Enums } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let responseData: any;

    // get auth user
    const authUser = req.user;

    if (!authUser) {
      unauthorizedError("Your are unauthorized for this action");
    }

    // validate incoming body data with defined schema
    const validatedData = teamQuerySchema.parse(req.query);

    // get user team info
    const userTeamInfo = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    console.log(authUser);

    // if not super user, get team members only

    const permittedRole: $Enums.role[] = ["superadmin", "director"];

    // if (permittedRole.includes(authUser?.role as $Enums.role)) {
    //   const { data, count } = await teamMemberService.getMultiByTeamId(
    //     userTeamInfo?.team_members?.team_id as string,
    //     validatedData
    //   );

    //   responseData = {
    //     success: true,
    //     message: "All teams get successfully!",
    //     data: data,
    //     pagination: {
    //       ...paginate(validatedData.page, validatedData.size, count),
    //     },
    //   };
    // } else {
      //get all items with validated queries
      const { data, count } = await teamMemberService.getMulti(validatedData);

      responseData = {
        success: true,
        message: "All teams get successfully!",
        data: data,
        pagination: {
          ...paginate(validatedData.page, validatedData.size, count),
        },
      };
    // }

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getTeamMembers };
