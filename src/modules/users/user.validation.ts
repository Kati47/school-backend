import { z } from "zod";

export const userCreateSchema = z.object({
  body: z.object({
    role: z.string(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(6),
    isActive: z.boolean().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const userUpdateSchema = z.object({
  body: z.object({
    role: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string().min(6).optional(),
    isActive: z.boolean().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
