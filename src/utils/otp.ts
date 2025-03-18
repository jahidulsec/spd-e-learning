export function addMinutesToDate(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export const generateOtp = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
};


export const verifyOtpTime = (expireAt: Date) => {
  const now = new Date();
  if (now.getTime() <= expireAt.getTime()) return true;
  return false;
};