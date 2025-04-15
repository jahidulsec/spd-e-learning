import z from "zod";

export const createCampaignDTOSchema = z.object({
  title: z.string().min(3),
  team_id: z.string().min(3),
});

export const campaignQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
});

export const updateCampaignDTOSchema = createCampaignDTOSchema
  .omit({ team_id: true })
  .partial();

export type createCampaignInputTypes = z.infer<typeof createCampaignDTOSchema>;

export type campaignQueryInputTypes = z.infer<typeof campaignQuerySchema>;

export type updateCampaignInputTypes = z.infer<typeof updateCampaignDTOSchema>;
