import { Request, Response } from "express";

export async function taskView(req: Request, res: Response) {
    try {
        res.render('index', {Greetings: "Hello world"})
    } catch (error) {
        console.log(error)
    }
}

export async function createTaskView(req: Request, res: Response) {
    try {
        res.render('Task/create', {Message: "Creating task"})
    } catch (error) {
        console.log(error)
    }
}
