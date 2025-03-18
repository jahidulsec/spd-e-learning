import db from "../db/db";
import { addMinutesToDate, generateOtp } from "../utils/otp";

const getForgetPasswordOTP = async (userId: string) => {
  //   generate otp
  const expireAt = addMinutesToDate(new Date(), 5);
  const code = generateOtp();

  // create otp by user id
  const data = await db.otp.create({
    data: {
      user_id: userId,
      code: code,
      expires_at: expireAt,
    },
  });

  return data;
};

export = { getForgetPasswordOTP };
