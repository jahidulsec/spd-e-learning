import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/user";
import { createUserDTOSchema } from "../../../../../schemas/user";
import { hashPassword } from "../../../../../utils/password";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createUserDTOSchema.parse(formData);

    // hash password
    if (validatedData.password) {
      validatedData.password = await hashPassword(validatedData.password);
    }

    //create new with validated data
    const created = await userService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New user created successfully!",
      data: created,
    };

    //send success response
    res.status(201).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { create as createUser };
