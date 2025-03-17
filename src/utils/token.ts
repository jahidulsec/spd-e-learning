import * as jwt from "jsonwebtoken";

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

export { generateAccessToken, generateRefreshToken };
