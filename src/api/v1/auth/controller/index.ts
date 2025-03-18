import { login } from "./user/login";
import { forgetPassword } from "./user/forget-password";
import { confirmOtp } from "./user/cofirm-otp";
import { resetPassoword } from "./user/reset-password";
import { initialLogin } from "./user/inital-login";

// token
import { revokeAccessToken } from "./token/revoke";

export = {
  login,
  forgetPassword,
  confirmOtp,
  resetPassoword,
  initialLogin,
  revokeAccessToken,
};
