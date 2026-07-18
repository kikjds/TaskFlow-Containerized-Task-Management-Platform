import * as authService from "../service/auth.service.js";
import { Request, Response } from "express";
import { authSchema } from "../validator/auth.validator.js";

export async function registerUser(req: Request, res: Response) {
    try {
        const { error } = authSchema.safeParse(req.body);
        if (error) {
            return res.status(400).render('auth/register', { Title: "Register", Message: "Invalid user data", Errors: error.issues });
        }
        await authService.registerUser(req, res);
    } catch (error) {
        console.log(error)
    }
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
    res.render("auth/register", { Title: "Register", Message: null, Errors: null });
}

export async function loginView(req: Request, res: Response) {
    if(req.session.userId) {
        return res.redirect('/')
    }
    res.render("auth/login", { Title: "Login", Message: null, Errors: null });
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