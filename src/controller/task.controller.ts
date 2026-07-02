import { Request, Response } from "express";
import * as taskService from "../service/task.service.js";

export async function taskView(req: Request, res: Response) {
    try {
        const tasks = await taskService.getAllTask()
        res.render('index', {Tasks: tasks})
    } catch (error) {
        console.log(error)
    }
}

export async function createTask(req:Request, res: Response) {
    try {
        await taskService.createTask(req, res)
        res.redirect("/")
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
