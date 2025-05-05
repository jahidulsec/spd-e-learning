import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateEScoreDTOSchema } from "../../../../../schemas/e-score";
import userService from "../../../../../lib/user";
import cmsService from "../../../../../lib/e-score";
import {
  badRequestError,
  forbiddenError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";
import { hasPermission, User } from "../../../../../policy/policy";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    //Validate incoming body data with defined schema
    const validatedData = updateEScoreDTOSchema.parse(formData);

    //check existing EDetailingScore
    const existingEDetailingScore = await cmsService.getSingle(validatedId);

    if (!existingEDetailingScore) {
      //send not found error if not exist
      notFoundError("E-DetailingT opic does not found");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "e_detailing_score",
      "update",
      existingEDetailingScore as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    // check score validation
    if (
      Number(validatedData.score_starting) >
      Number(
        existingEDetailingScore?.e_detailing_video.e_detailing.score_starting
      )
    ) {
      badRequestError(
        "Score starting can not be greater than test starting score"
      );
    }

    if (
      Number(validatedData.score_closing) >
      Number(
        existingEDetailingScore?.e_detailing_video.e_detailing.score_closing
      )
    ) {
      badRequestError(
        "Score closing can not be greater than test closing score"
      );
    }

    if (
      Number(validatedData.score_content) >
      Number(
        existingEDetailingScore?.e_detailing_video.e_detailing.score_content
      )
    ) {
      badRequestError(
        "Score content can not be greater than test content score"
      );
    }

    if (
      Number(validatedData.score_presentation) >
      Number(
        existingEDetailingScore?.e_detailing_video.e_detailing
          .score_presentation
      )
    ) {
      badRequestError(
        "Score presentation can not be greater than test presentation score"
      );
    }

    //update with validated data
    const updated = await cmsService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("e-detailing Score not updated");
    }

    const responseData = {
      success: true,
      message: "e-detailing Score updated successfully!",
      data: updated,
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { update as updateScore };
