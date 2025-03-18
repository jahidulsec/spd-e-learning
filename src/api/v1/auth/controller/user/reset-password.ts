import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createResetPasswordDTOSchema } from "../../../../../schemas/user";
import {
  badRequestError,
  notFoundError,
  unauthorizedError,
} from "../../../../../utils/errors";
import { hashPassword } from "../../../../../utils/password";

const resetPassoword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get user id from token
    const authUser = req.user;

    if (!authUser) {
      unauthorizedError("You do not have permission for this action");
    }

    // check user
    const user = await userService.getSingle({ id: authUser?.id as string });

    if (!user) {
      notFoundError("User does not exist");
    }

    // get form data
    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createResetPasswordDTOSchema.parse(formData);

    // check new and confirm password
    if (validatedData.new_password !== validatedData.confirm_password) {
      badRequestError("Confirm password does not match with new password");
    }

    // reset password
    const hashedPassword = await hashPassword(validatedData.new_password);

    const data = await userService.updateOne(
      { id: authUser?.id as string },
      { password: hashedPassword }
    );

    const responseData = {
      success: true,
      message: `Password reset is successful`,
      data,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { resetPassoword };
