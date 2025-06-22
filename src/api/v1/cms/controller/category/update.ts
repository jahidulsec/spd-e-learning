import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateCategoryDTOSchema } from "../../../../../schemas/category";
import userService from "../../../../../lib/user";
import cmsService from "../../../../../lib/category";
import {
  forbiddenError,
  notFoundError,
  serverError,
  unauthorizedError,
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
    const validatedData = updateCategoryDTOSchema.parse(formData);

    //check existing Category
    const existingCategory = await cmsService.getSingle(validatedId);

    if (!existingCategory) {
      //send not found error if not exist
      notFoundError("Category does not found");
    }

    // check permission
    const isPermitted = hasPermission(
      user as User,
      "categories",
      "update",
      existingCategory as any
    );

    if (!isPermitted) {
      forbiddenError(`You are unauthorized for this action`);
    }

    // only superadmin can archived
    if (
      authUser?.role !== "superadmin" &&
      validatedData.is_archived !== undefined
    ) {
      validatedData.is_archived = false;
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

export { update as updateCategory };
