import { Request, Response, NextFunction } from "express-serve-static-core";
import userService from "../../../../../lib/team-member";
import { createTeamMemberDTOSchema } from "../../../../../schemas/team-member";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createTeamMemberDTOSchema.parse(formData);

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
