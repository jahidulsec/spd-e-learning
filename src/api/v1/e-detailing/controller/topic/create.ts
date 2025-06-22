import { Request, Response, NextFunction } from "express-serve-static-core";
import { createEDetailingDTOSchema } from "../../../../../schemas/e-detailing";
import userService from "../../../../../lib/user";
import topicService from "../../../../../lib/e-detailing";
import quaterService from "../../../../../lib/quater";
import {
  badRequestError,
  forbiddenError,
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

    //Validate incoming body data with defined schema
    const validatedData = createEDetailingDTOSchema.parse(formData);

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

    // get quater and check validate time range by quater time range
    const quater = await quaterService.getSingle({
      id: validatedData.quater_id,
    });

    if (!quater) {
      notFoundError("Quater does not exist");
      return;
    }

    if (
      validatedData.start_date < quater?.start_date ||
      validatedData.end_date > quater?.end_date
    ) {
      badRequestError("Given date range is not in quater date range");
    }

    //create new with validated data
    const created = await topicService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New e-Detailing topic created successfully!",
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

export { create as createTopic };
