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

const getOtpProfile = async (id: string) => {
  const data = await db.otp.findUnique({
    where: { id },
  });

  return data;
};

const deleteOtp = async (id: string) => {
  const data = await db.otp.delete({
    where: { id },
  });

  return data;
};

export = { getForgetPasswordOTP, getOtpProfile, deleteOtp };
