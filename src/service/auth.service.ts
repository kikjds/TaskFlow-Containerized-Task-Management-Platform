import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../model/user.model.js";
import { authSchema, loginSchema } from "../validator/auth.validator.js";

export async function registerUser(data: z.infer<typeof authSchema>) {
    const { username, password, email } = data;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return {
            success: false,
            message: "Username already exists",
        };
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
        username,
        password: hash,
        email,
    });

    return {
        success: true,
    };
}

export async function loginUser(data: z.infer<typeof loginSchema>) {
    const { username, password } = data;

    const user = await User.findOne({ username });

    if (!user) {
        return {
            success: false,
            message: "Invalid username or password",
        };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return {
            success: false,
            message: "Invalid username or password",
        };
    }

    return {
        success: true,
        user,
    };
}