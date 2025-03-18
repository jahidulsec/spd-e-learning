import z from "zod";

export const createRevokeTokenDTOSchema = z.object({
  refresh_token: z.string(),
});

export type createRevokeTokenInputsTypes = z.infer<typeof createRevokeTokenDTOSchema>;
