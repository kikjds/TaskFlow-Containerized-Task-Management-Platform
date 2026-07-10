import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export async function registerUser(req: Request, res: Response) {
    try {
        const { username, password, email } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hash = await bcrypt.hash(password, 10);
        await User.create({ username, password: hash, email });
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
}

export async function loginUser(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        req.session.userId = user._id.toString();
        req.session.username = user.username;
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
}