import z from "zod";

export const createQuaterDTOSchema = z.object({
  title: z.string().min(3),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
});

export const quaterQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
});

export const updateQuaterDTOSchema = createQuaterDTOSchema.omit({}).partial();

export type createQuaterInputTypes = z.infer<typeof createQuaterDTOSchema>;

export type quaterQueryInputTypes = z.infer<typeof quaterQuerySchema>;

export type updateQuaterInputTypes = z.infer<typeof updateQuaterDTOSchema>;
