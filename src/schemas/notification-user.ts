import z from "zod";

export const createNotificationUserDTOSchema = z.object({
  user_id: z.string().min(1),
  notification_id: z.string().min(1),
});

export const NotificationUserQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
});

export const updateNotificationUserDTOSchema = createNotificationUserDTOSchema
  .omit({})
  .partial();

export type createNotificationUserInputTypes = z.infer<typeof createNotificationUserDTOSchema>;

export type NotificationUserQueryInputTypes = z.infer<typeof NotificationUserQuerySchema>;

export type updateNotificationUserInputTypes = z.infer<typeof updateNotificationUserDTOSchema>;
