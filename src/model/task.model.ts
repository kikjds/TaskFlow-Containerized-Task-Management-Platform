import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    title: String,
    description: String
})

export const Task = mongoose.model("Task", taskSchema)