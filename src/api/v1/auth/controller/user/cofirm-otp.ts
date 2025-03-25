import { Request, Response, NextFunction } from "express-serve-static-core";
import { createOtpDTOSchema } from "../../../../../schemas/user";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import authService from "../../../../../lib/auth";
import userService from "../../../../../lib/user";
import { badRequestError, notFoundError } from "../../../../../utils/errors";
import { verifyOtpTime } from "../../../../../utils/otp";
import { generateAccessToken } from "../../../../../utils/token";

const confirmOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //validate incoming params id
    const validatedId = requiredIdSchema.parse(req.params);

    //Validate incoming body data with defined schema
    const validatedData = createOtpDTOSchema.parse(formData);

    // check existing otp
    const existingOtpProfile = await authService.getOtpProfile(validatedId.id);

    if (!existingOtpProfile || existingOtpProfile.code != validatedData.code) {
      //send not found error if not exist
      notFoundError("Invalid OTP");
    }

    // check otp expire time
    const isVerified = verifyOtpTime(existingOtpProfile?.expires_at as Date);

    if (!isVerified) {
      badRequestError("OTP is expired");
    }

    // get user
    const user = await userService.getSingle({
      id: existingOtpProfile?.user_id as string,
    });

    // generate access token
    const accessToken = generateAccessToken(
      user?.sap_id as string,
      user?.role as string,
      user?.team_members?.id
    );

    // delete Otp
    await authService.deleteOtp(validatedId.id);

    const responseData = {
      success: true,
      message: `OTP verification is successful`,
      data: {
        accessToken: accessToken,
      },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { confirmOtp };
