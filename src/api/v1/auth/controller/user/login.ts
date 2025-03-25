import { Request, Response, NextFunction } from "express-serve-static-core";
import { userLoginDTOSchema } from "../../../../../schemas/user";
import userService from "../../../../../lib/user";
import { notFoundError, unauthorizedError } from "../../../../../utils/errors";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../../utils/token";
import { isValidPassword } from "../../../../../utils/password";
import { addMinutesToDate } from "../../../../../utils/otp";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = userLoginDTOSchema.parse(formData);

    // check user
    const user = await userService.getSingle({ id: validatedData.sap_id });

    if (!user) {
      notFoundError("User does not exist");
    }

    // verify password
    const isVerified = await isValidPassword(
      validatedData.password,
      user?.password as string
    );

    if (!isVerified) {
      unauthorizedError("Incorrect password");
    }

    const accessToken = generateAccessToken(
      user?.sap_id as string,
      user?.role as string,
      user?.team_members?.id
    );

    const refreshToken = generateRefreshToken(user?.sap_id as string);

    const responseData = {
      success: true,
      message: `Login is successful`,
      data: {
        accessToken: accessToken,
      },
    };

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.COOKIE_SECURE === "true",
        path: "/",
        expires: addMinutesToDate(new Date(), 24 * 60), // for 1 day
      })
      .json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { login };
