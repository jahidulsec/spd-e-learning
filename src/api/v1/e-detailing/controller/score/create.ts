import { Request, Response, NextFunction } from "express-serve-static-core";
import { createEScoreDTOSchema } from "../../../../../schemas/e-score";
import userService from "../../../../../lib/user";
import scoreService from "../../../../../lib/e-score";
import videoService from "../../../../../lib/e-video";
import {
  badRequestError,
  forbiddenError,
  notFoundError,
} from "../../../../../utils/errors";
import { hasPermission, User } from "../../../../../policy/policy";

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
    const validatedData = createEScoreDTOSchema.parse(formData);

    // get video
    const video = await videoService.getSingle({ id: validatedData.video_id });

    if (!video) {
      notFoundError("video does not exist");
      return;
    }

    // check permission
    const isPermitted = hasPermission(
      user as any,
      "e_detailing_score",
      "create",
      video as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    // add scored by id
    if (user?.role === "team_lead") {
      validatedData.scored_by =
        user?.team_members.filter(
          (item) => item.team_id === video.team_member.team_id
        )?.[0]?.id || undefined;
    }

    // check score validation
    if (
      Number(validatedData.score_starting) >
      Number(video.e_detailing.score_starting)
    ) {
      badRequestError(
        "Score starting can not be greater than test starting score"
      );
    }

    if (
      Number(validatedData.score_closing) >
      Number(video.e_detailing.score_closing)
    ) {
      badRequestError(
        "Score closing can not be greater than test closing score"
      );
    }

    if (
      Number(validatedData.score_content) >
      Number(video.e_detailing.score_content)
    ) {
      badRequestError(
        "Score content can not be greater than test content score"
      );
    }

    if (
      Number(validatedData.score_presentation) >
      Number(video.e_detailing.score_presentation)
    ) {
      badRequestError(
        "Score presentation can not be greater than test presentation score"
      );
    }

    //create new with validated data
    const created = await scoreService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New e-Detailing score created successfully!",
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

export { create as createScore };
