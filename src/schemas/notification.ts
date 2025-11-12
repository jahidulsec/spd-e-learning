import z from "zod";

export const createNotificationDTOSchema = z.object({
  title: z.string().min(3),
  team_id: z.string().optional(),
  type: z.enum(['file', 'quiz', 'e-learning']),
});

export const NotificationQuerySchema = z.object({
  sort: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().default(1),
  size: z.coerce.number().default(20),
  search: z.string().optional(),
  user_id: z.string().optional(),
  sort_type: z.enum(["created_at", "title"]).default("created_at"),
});

export const updateNotificationDTOSchema = createNotificationDTOSchema
  .omit({ team_id: true })
  .partial();

export type createNotificationInputTypes = z.infer<typeof createNotificationDTOSchema>;

export type NotificationQueryInputTypes = z.infer<typeof NotificationQuerySchema>;

export type updateNotificationInputTypes = z.infer<typeof updateNotificationDTOSchema>;
