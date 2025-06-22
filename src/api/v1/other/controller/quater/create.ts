import { Request, Response, NextFunction } from "express-serve-static-core";
import quizService from "../../../../../lib/quater";
import { createQuaterDTOSchema } from "../../../../../schemas/quater";
import { badRequestError } from "../../../../../utils/errors";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    // get auth user
    const authUser = req.user;

    //Validate incoming body data with defined schema
    const validatedData = createQuaterDTOSchema.parse(formData);

    // check start date should be less than end date
    if (validatedData.start_date > validatedData.end_date) {
      badRequestError("Start date should be less than end date");
    }

    // check for end date
    const existingQuaters = await quizService.getMulti({
      size: 1,
      page: 1,
      start_date: validatedData.start_date,
      end_date: validatedData.end_date,
      sort: "desc",
      sort_type: "created_at",
    });

    if (existingQuaters.count > 0) {
      badRequestError(
        `No of ${existingQuaters} quater is exist${
          existingQuaters.count > 1 ? "s" : ""
        } in this date range`
      );
    }

    // only superadmin can archive
    if (authUser?.role !== "superadmin") {
      validatedData.is_archived = false;
    }

    //create new with validated data
    const created = await quizService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New quater created successfully!",
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

export { create as createQuater };
