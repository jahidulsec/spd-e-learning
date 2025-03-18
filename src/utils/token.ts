import * as jwt from "jsonwebtoken";
import { forbiddenError } from "./errors";

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    { id: userId, role: role, type: "access" },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "10m",
    }
  );
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { id: userId, type: "refresh" },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
};

const validateRefreshToken = (refreshToken: string) => {
  let data: any = null;
  jwt.verify(
    refreshToken as string,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, user) => {
      console.log(err);
      if (err) forbiddenError("Invalid token");

      data = user;
    }
  );

  return data;
};

export { generateAccessToken, generateRefreshToken, validateRefreshToken };
