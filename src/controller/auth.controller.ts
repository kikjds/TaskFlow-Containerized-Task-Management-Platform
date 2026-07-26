import { Request, Response, NextFunction } from "express";
import * as authService from "../service/auth.service.js";
import { authSchema, loginSchema } from "../validator/auth.validator.js";

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        const result = authSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).render("auth/register", {
                Title: "Register",
                Message: "Invalid user data",
                Errors: result.error.issues,
                username: req.body.username,
                email: req.body.email,
            });
        }

        const response = await authService.registerUser(result.data);

        if (!response.success) {
            return res.status(400).render("auth/register", {
                Title: "Register",
                Message: response.message,
                Errors: null,
                username: result.data.username,
                email: result.data.email,
            });
        }

        return res.redirect("/login");
    } catch (error) {
        next(error);
    }
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).render("auth/login", {
                Title: "Login",
                Message: "Invalid credentials",
                Errors: result.error.issues,
                username: req.body.username,
            });
        }

        const response = await authService.loginUser(result.data);

        if (!response.success) {
            return res.status(400).render("auth/login", {
                Title: "Login",
                Message: response.message,
                Errors: null,
                username: result.data.username,
            });
        }

        req.session.regenerate((err) => {
            if (err) {
                return next(err);
            }

            req.session.userId = response.user!._id.toString();
            req.session.username = response.user!.username;

            res.redirect("/");
        });
    } catch (error) {
        next(error);
    }
}

export function registerView(req: Request, res: Response) {
    if (req.session.userId) {
        return res.redirect("/");
    }

    res.render("auth/register", {
        Title: "Register",
        Message: null,
        Errors: null,
        username: null,
        email: null,
    });
}

export function loginView(req: Request, res: Response) {
    if (req.session.userId) {
        return res.redirect("/");
    }

    res.render("auth/login", {
        Title: "Login",
        Message: null,
        Errors: null,
        username: null,
    });
}

export function logoutUser(req: Request, res: Response, next: NextFunction) {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }

        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
}