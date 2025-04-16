import { Request, Response, NextFunction } from "express-serve-static-core";
import quizService from "../../../../../lib/quater";
import { createQuaterDTOSchema } from "../../../../../schemas/quater";
import { badRequestError } from "../../../../../utils/errors";
import db from "../../../../../db/db";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    //Validate incoming body data with defined schema
    const validatedData = createQuaterDTOSchema.parse(formData);

    // check start date should be less than end date
    if (validatedData.start_date > validatedData.end_date) {
      badRequestError("Start date should be less than end date");
    }

    // check existing quater by start date to avoid duplication
    const existingQuaters = await db.quater.count({
      where: {
        start_date: {
          gte: validatedData.start_date,
        },
      },
    });

    // check for end date
    const existingQuaters2 = await db.quater.count({
      where: {
        start_date: {
          gte: validatedData.start_date,
        },
        end_date: {
          lte: validatedData.end_date,
        },
      },
    });

    if (existingQuaters > 0 || existingQuaters2 > 0) {
      badRequestError(
        `No of ${existingQuaters || existingQuaters2} quater is exist${
          existingQuaters > 1 || existingQuaters2 > 1 ? "s" : ""
        } in this date range`
      );
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
