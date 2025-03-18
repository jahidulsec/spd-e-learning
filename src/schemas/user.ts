import { phoneRegex } from "../utils/regex";
import { z } from "zod";

export const createUserDTOSchema = z.object({
  sap_id: z.string(),
  password: z.string().optional(),
  full_name: z.string(),
  mobile: z.string().regex(phoneRegex, { message: "Invalid phone number" }),
  role: z.enum(["superadmin", "mios", "team_lead", "director"]),
  status: z.enum(["active", "inactive"]).optional(),
});

export const updateUserDTOSchema = createUserDTOSchema.omit({}).partial();

export const usersQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  sortBy: z.string().default("updatedAt"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
});

export type createUserInputsTypes = z.infer<typeof createUserDTOSchema>;
export type updateUserInputTypes = z.infer<typeof updateUserDTOSchema>;
export type usersQueryInputTypes = z.infer<typeof usersQuerySchema>;

// login

export const userLoginDTOSchema = z.object({
  sap_id: z.string().min(3),
  password: z.string().min(6),
});

export type usersLoginInputTypes = z.infer<typeof userLoginDTOSchema>;

// forget password

export const userForgetPasswordDTOSchema = z.object({
  mobile: z.string().regex(phoneRegex, { message: "Invalid phone number" }),
});

export type userForgetPassworInputTypes = z.infer<
  typeof userForgetPasswordDTOSchema
>;

// OTP

export const createOtpDTOSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type createOtpInputTypes = z.infer<typeof createOtpDTOSchema>;

// reset password
export const createResetPasswordDTOSchema = z.object({
  new_password: z.string().min(6),
  confirm_password: z.string().min(6),
});

export const createInitalLogindDTOSchema = z.object({
  sap_id: z.string(),
});
