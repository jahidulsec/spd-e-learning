import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import { updateUserDTOSchema } from "../../../../../schemas/user";
import cmsService from "../../../../../lib/user";
import {
  notFoundError,
  serverError,
  unauthorizedError,
} from "../../../../../utils/errors";
import { hashPassword } from "../../../../../utils/password";

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    if (!authUser) {
      unauthorizedError("Your are unauthorized for this action");
    }

    const formData = req.body;

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    if (authUser?.role === "superadmin" || authUser?.id === validatedId.id) {
      // Validate incoming body data with defined schema
      const validatedData = updateUserDTOSchema.parse(formData);

      // hash password
      if (validatedData.password) {
        validatedData.password = await hashPassword(validatedData.password);
      }

      //check existing User
      const existingUser = await cmsService.getSingle(validatedId);

      if (!existingUser) {
        //send not found error if not exist
        notFoundError("User does not found");
      }

      //update with validated data
      const updated = await cmsService.updateOne(validatedId, validatedData);

      if (!updated) {
        serverError("User not updated");
      }

      const responseData = {
        success: true,
        message: "User updated successfully!",
        data: updated,
      };

      //send success response
      return res.status(200).json(responseData);
    }

    // else unauthorize
    unauthorizedError("Your are unauthorized for this action");
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { update as updateUser };
