import {z} from "zod"

export const taskSchema = z.object({
    title: z.string().min(1, {message: "Title is required"}).max(100, {message: "Title must be less than 100 characters"}),
    description: z.string().max(500, {message: "Description must be less than 500 characters"}).optional(),
    deadline: z.string().refine(date => {
        const today = new Date();
        const inputDate = new Date(date);
        return inputDate > today;
    }, {message: "Deadline must be a valid date"})
})