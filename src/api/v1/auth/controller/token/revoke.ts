import { Request, Response, NextFunction } from "express-serve-static-core";
import {
  notFoundError,
  unauthorizedError,
} from "../../../../../utils/errors";
import userService from "../../../../../lib/user";
import {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
} from "../../../../../utils/token";
import { addMinutesToDate } from "../../../../../utils/otp";

const revoke = async (req: Request, res: Response, next: NextFunction) => {
  try {

    // get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    // validate token
    if (!req.cookies.refreshToken) {
      unauthorizedError("You are unauthorized for this action");
    }

    // get token info

    let data = validateRefreshToken(refreshToken)

    // check user
    const user = await userService.getSingle({ id: data.id as string });

    if (!user) {
      notFoundError("User does not exist");
    }

    // generate token
    const accessToken = generateAccessToken(
      user?.sap_id as string,
      user?.role as string,
      user?.team_members?.id
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
        sameSite: 'none',
        path: '/',
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
