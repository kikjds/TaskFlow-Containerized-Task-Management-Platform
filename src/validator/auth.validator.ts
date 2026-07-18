import { z } from "zod"

export const authSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }).max(50, { message: "Username must be less than 50 characters" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100, { message: "Password must be less than 100 characters" }),
    email: z.string().email({ message: "Invalid email address" }).max(100, { message: "Email must be less than 100 characters" }),
    notifications: z.boolean().optional()
})