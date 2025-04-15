import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateQuaterDTOSchema } from "../../../../../schemas/quater";
import quaterService from "../../../../../lib/quater";
import {
  badRequestError,
  notFoundError,
  serverError,
} from "../../../../../utils/errors";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    // Validate incoming body data with defined schema
    const validatedData = updateQuaterDTOSchema.parse(formData);

    //check existing Quater
    const existingQuater = await quaterService.getSingle(validatedId);

    if (!existingQuater) {
      //send not found error if not exist
      notFoundError("Quater does not found");
      return;
    }

    // check start date should be less than end date
    const startDate = validatedData.start_date ?? existingQuater?.start_date;
    const endDate = validatedData.end_date ?? existingQuater?.end_date;

    if (startDate > endDate) {
      badRequestError("Start date should be less than end date");
    }

    //update with validated data
    const updated = await quaterService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Quater not updated");
    }

    const responseData = {
      success: true,
      message: "Quater updated successfully!",
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

export { update as updateQuater };
