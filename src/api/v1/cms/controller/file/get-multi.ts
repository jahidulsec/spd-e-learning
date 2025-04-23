import { Request, Response, NextFunction } from "express-serve-static-core";
import { paginate } from "../../../../../utils/pagination";
import userService from "../../../../../lib/user";
import { fileQuerySchema } from "../../../../../schemas/file";
import cmsService from "../../../../../lib/file";
import { $Enums, file } from "@prisma/client";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get auth user
    const authUser = req.user;

    // validate incoming body data with defined schema
    const validatedData = fileQuerySchema.parse(req.query);

    // authorization section
    let data: file[] = [];
    let count: number = 0;

    if (
      (["superadmin", "director"] as $Enums.role[]).includes(
        authUser?.role as $Enums.role
      )
    ) {
      //get all items with validated queries
      const result = await cmsService.getMulti(validatedData);

      data = result.data;
      count = result.count;
    } 
    else {
      const result = await cmsService.getMultiByUserId(
        authUser?.id as string,
        validatedData
      );

      data = result.data;
      count = result.count;
    }

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
