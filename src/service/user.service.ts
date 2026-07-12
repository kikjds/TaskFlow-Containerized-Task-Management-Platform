import { Request, Response } from "express";
import { User } from "../model/user.model.js";
import mongoose from "mongoose";

export function getUserById(req: Request, res: Response) {
    try {
        const userId = req.session.userId;
        return User.findById(userId);        
    } catch (error) {
        console.log(error)
    }
}

export async function updateUserBasedOnId(req: Request, res: Response) {
    try {
        const userId = req.session.userId;
        const { username, email, notifications } = req.body;      
        const user =  await User.find({ _id: new mongoose.Types.ObjectId(userId)})
        if(user) {
            user[0].username = username;
            user[0].email = email;
            user[0].notifications = notifications;
            await user[0].save();
            return
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
    }
}