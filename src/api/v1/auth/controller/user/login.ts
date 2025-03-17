import { Request, Response, NextFunction } from "express-serve-static-core";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;

    res.send("ok");
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { login };
