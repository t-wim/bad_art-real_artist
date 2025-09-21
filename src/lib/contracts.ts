import { z } from "zod";
export const Artwork = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  mime: z.enum(["image/png", "image/jpeg", "image/webp"]),
  imageBase64: z.string(),
  createdAt: z.string().datetime().optional(),
});
export type TArtwork = z.infer<typeof Artwork>;

export const ArtworkList = z.object({
  items: z.array(Artwork),
  nextCursor: z.string().nullable().optional(),
});
export type TArtworkList = z.infer<typeof ArtworkList>;
