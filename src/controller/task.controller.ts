import { Request, Response } from "express";
import * as taskService from "../service/task.service.js";

export async function taskView(req: Request, res: Response) {
    try {
        const tasks = await taskService.getAllTask(req, res)
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

export async function editTaskView(req:Request, res: Response) {
    try {
        const id = req.params.id
        if(!id) res.redirect('/')
        const taskId = Array.isArray(id) ? id[0] : id
        const task = await taskService.getTaskById(taskId)    
        res.render('Task/edit', {task: task})
    } catch (error) {
        console.log(error)
    }
}

export async function editTask(req:Request, res:Response) {
    try {
        await taskService.editTaskById(req, res)
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

export async function deleteTask(req: Request, res: Response) {
    try {
        const id = req.params.id
        if(!id) res.redirect('/')
        const taskId = Array.isArray(id) ? id[0] : id
        await taskService.deleteTaskById(taskId)
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}
