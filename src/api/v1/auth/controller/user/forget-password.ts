import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import authService from "../../../../../lib/auth";
import { userForgetPasswordDTOSchema } from "../../../../../schemas/user";
import { notFoundError, serverError } from "../../../../../utils/errors";

const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = userForgetPasswordDTOSchema.parse(formData);

    // check user
    const user = await userService.getSingleByMobile(validatedData.mobile);

    if (!user) {
      notFoundError("User does not exist");
    }

    // create otp
    // create new with validated data
    const created = await authService.getForgetPasswordOTP(
      user?.sap_id as string
    );

    // send otp to mobile
    const message = `Your One-Time Password (OTP) for SPD E-Learning forget password is ${created.code}.`;

    const send = await fetch(
      `https://api.mobireach.com.bd/SendTextMessage?Username=${process.env.SMS_USERNAME}&Password=${process.env.SMS_PASSWORD}&From=Impala&To=${validatedData.mobile}&Message=${message}`,
      {
        method: "GET",
      }
    );

    if (!send.ok) {
      serverError("Something went wrong!");
    }

    const responseData = {
      success: true,
      message: "OTP is sent to " + validatedData.mobile,
      data: {
        id: created.id,
        user_id: created.user_id,
        mobile: validatedData.mobile,
        expires_at: created.expires_at,
      },
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { forgetPassword };
