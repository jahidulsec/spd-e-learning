import { Request, Response, NextFunction } from "express-serve-static-core";
import { createRevokeTokenDTOSchema } from "../../../../../schemas/token";
import {
  forbiddenError,
  notFoundError,
  unauthorizedError,
} from "../../../../../utils/errors";
import userService from "../../../../../lib/user";
import * as jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../../utils/token";
import { addMinutesToDate } from "../../../../../utils/otp";

const revoke = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createRevokeTokenDTOSchema.parse(formData);

    // get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    // validate token
    if (refreshToken !== validatedData.refresh_token) {
      unauthorizedError("You are unauthorized for this action");
    }

    // get token info

    let data: any;

    jwt.verify(
      refreshToken as string,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err, user) => {
        console.log(err);
        if (err) forbiddenError("Invalid token");

        data = user;
      }
    );

    // check user
    const user = await userService.getSingle({ id: data.id as string });

    if (!user) {
      notFoundError("User does not exist");
    }

    // generate token
    const accessToken = generateAccessToken(
      user?.sap_id as string,
      user?.role as string
    );

    const newRefreshToken = generateRefreshToken(user?.sap_id as string);

    const responseData = {
      success: true,
      message: `Token revoke successful`,
      data: {
        accessToken: accessToken,
      },
    };

    res
      .status(200)
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        // secure: ,
        sameSite: "lax",
        expires: addMinutesToDate(new Date(), 24 * 60), // for 1 day
      })
      .json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { revoke as revokeAccessToken };
