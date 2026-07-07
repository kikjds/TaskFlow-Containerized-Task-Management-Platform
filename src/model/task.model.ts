import mongoose, { Schema } from "mongoose";


const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    isCompleted: { type: Boolean, default: false },
    deadline: { type: Date, default: null },
}, { timestamps: true }
);


export const Task = mongoose.model("Task", taskSchema)