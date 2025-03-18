import { Request, Response, NextFunction } from "express-serve-static-core";

const del = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send("ok");
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { del as delFolder };
