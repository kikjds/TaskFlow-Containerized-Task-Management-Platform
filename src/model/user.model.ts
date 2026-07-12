import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    notifications: { type: Boolean, default: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }]
})

export const User = mongoose.model("User", userSchema)