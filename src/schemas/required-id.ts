import { z } from "zod";

export const requiredIdSchema = z.object({
  id: z.string(),
});

export type requiredIdTypes = z.infer<typeof requiredIdSchema>;
