import * as authService from "../service/auth.service.js";
import { Request, Response } from "express";

export async function registerUser(req: Request, res: Response) {
    await authService.registerUser(req, res);
}

export async function loginUser(req: Request, res: Response) {
    try {
        await authService.loginUser(req, res);
    } catch (error) {
        console.log(error)
    }

}

export async function registerView(req: Request, res: Response) {
    if(req.session.userId) {
        return res.redirect('/')
    }
    res.render("auth/register");
}

export async function loginView(req: Request, res: Response) {
    if(req.session.userId) {
        return res.redirect('/')
    }
    res.render("auth/login");
}

export async function logoutUser(req: Request, res: Response) {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/login');
        });
    } catch (error) {
        console.log(error)
    }
}