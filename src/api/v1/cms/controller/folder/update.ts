import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateCategoryDTOSchema } from "../../../../../schemas/category";
import cmsService from "../../../../../lib/category";
import { notFoundError, serverError } from "../../../../../utils/errors";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    //Validate incoming body data with defined schema
    const validatedData = updateCategoryDTOSchema.parse(formData);

    //check existing Category
    const existingCategory = await cmsService.getSingle(validatedId);

    if (!existingCategory) {
      //send not found error if not exist
      notFoundError("Category does not found");
    }

    //update with validated data
    const updated = await cmsService.updateOne(validatedId, validatedData);

    if (!updated) {
      serverError("Category not updated");
    }

    const responseData = {
      success: true,
      message: "Category updated successfully!",
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

export { update as updateFolder };
