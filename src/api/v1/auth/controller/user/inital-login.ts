import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createInitalLogindDTOSchema } from "../../../../../schemas/user";
import { badRequestError, notFoundError } from "../../../../../utils/errors";
import { generateAccessToken } from "../../../../../utils/token";

const initialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get form data
    const formData = req.body;

    // validate data
    const validatedData = createInitalLogindDTOSchema.parse(formData);

    // get user by sap ID
    const user = await userService.getSingle({ id: validatedData.sap_id });

    if (!user) {
      notFoundError("User does not exist");
    }

    // check if user has password
    if (user?.password) {
      badRequestError("You already have a password");
    }

    // generate access token
    const accessToken = generateAccessToken(
      user?.sap_id as string,
      user?.role as string,
    );

    const responseData = {
      success: true,
      message: `Your are permitted for inital login`,
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

export { initialLogin };
