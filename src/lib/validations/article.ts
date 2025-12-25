import { z } from 'zod';

export const articleSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title must not exceed 200 characters' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(5000, { message: 'Description must not exceed 5000 characters' }),
  cover_image_url: z
    .string()
    .min(1, { message: 'Cover image URL is required' })
    .url({ message: 'Please enter a valid URL' }),
  category: z.string().optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
