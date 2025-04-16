import { Request, Response, NextFunction } from "express-serve-static-core";
import { createOptionDTOSchema } from "../../../../../schemas/option";
import cmsService from "../../../../../lib/option";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createOptionDTOSchema.parse(formData);

    //create new with validated data
    const created = await cmsService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New quiz option created successfully!",
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

export { create as createOption };
