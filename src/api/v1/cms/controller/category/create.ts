import { Request, Response, NextFunction } from "express-serve-static-core";
import { createCategoryDTOSchema } from "../../../../../schemas/category";
import userService from "../../../../../lib/user";
import cmsService from "../../../../../lib/category";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // get user info
    const user = await userService.getSingleWithTeamInfo(
      authUser?.id as string
    );

    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createCategoryDTOSchema.parse(formData);

    //create new with validated data
    const created = await cmsService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New category created successfully!",
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

export { create as createCategory };
