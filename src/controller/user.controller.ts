import { Request, Response, NextFunction } from "express";
import * as userService from "../service/user.service.js";

export async function updateUserSettingsView(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await userService.getUserById(req.session.userId!);

        if (!user) {
            return res.redirect("/login");
        }

        return res.render("user/settings", { user });
    } catch (error) {
        next(error);
    }
}

export async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await userService.updateUserBasedOnId(
            req.session.userId!,
            req.body.username,
            req.body.email,
            req.body.notifications
        );

        if (!user) {
            return res.redirect("/login");
        }

        return res.redirect("/settings");
    } catch (error) {
        next(error);
    }
}