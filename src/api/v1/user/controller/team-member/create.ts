import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/team";
import { createTeamDTOSchema } from "../../../../../schemas/team";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createTeamDTOSchema.parse(formData);

    //create new with validated data
    const created = await userService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New team created successfully!",
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

export { create as createTeamMember };
