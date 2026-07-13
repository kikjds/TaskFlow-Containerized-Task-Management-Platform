import { Request, Response } from "express";
import * as userService from "../service/user.service.js";

export async function updateUserSettingsView(req: Request, res: Response) {
    try {
        const user = await userService.getUserById(req, res);
        console.log(user)
        if (user) {
            res.render("user/settings", { user });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);

    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        await userService.updateUserBasedOnId(req, res);
        res.redirect('/settings');
    } catch (error) {
        console.log(error);
    }
}