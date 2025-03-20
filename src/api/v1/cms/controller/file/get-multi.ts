import { Request, Response, NextFunction } from "express-serve-static-core";
import { paginate } from "../../../../../utils/pagination";
import { fileQuerySchema } from "../../../../../schemas/file";
import cmsService from "../../../../../lib/file";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate incoming body data with defined schema
    const validatedData = fileQuerySchema.parse(req.query);

    //get all items with validated queries
    const { data, count } = await cmsService.getMulti(validatedData);

    // adding file_path in every file
    const modifiedData = data.map((file) => {
      return {
        ...file,
        file_path: `${req.protocol}://${req.get("host")}/uploads/files/${
          file.filename
        }`,
      };
    });

    const responseData = {
      success: true,
      message: "All files get successfully!",
      data: modifiedData,
      pagination: {
        ...paginate(validatedData.page, validatedData.size, count),
      },
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getFiles };
