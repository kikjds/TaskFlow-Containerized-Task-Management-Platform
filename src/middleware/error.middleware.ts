import { Request, Response, NextFunction } from "express";

export default function errorMiddleware(req: Request, res: Response, next: NextFunction) {
    res.status(500).render("error/error", {
        Title: "Error",
        Message: "An unexpected error occurred. Please try again later."
    });
}