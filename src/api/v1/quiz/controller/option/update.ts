import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateOptionDTOSchema } from "../../../../../schemas/option";
import cmsService from "../../../../../lib/option";
import { notFoundError, serverError } from "../../../../../utils/errors";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    //Validate incoming body data with defined schema
    const validatedData = updateOptionDTOSchema.parse(formData);

    //check existing Option
    const existingOption = await cmsService.getSingle(validatedId);

    if (!existingOption) {
      //send not found error if not exist
      notFoundError("Option does not found");
    }

    //update with validated data
    const updated = await cmsService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Option not updated");
    }

    const responseData = {
      success: true,
      message: "Option updated successfully!",
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

export { update as updateOption };
