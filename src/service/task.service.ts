import { Task } from "../model/task.model.js";
import { Request, Response } from "express";

export function getAllTask() {
 return Task.find()     
}

export async function createTask(req: Request, res: Response) {
    const { title, description } = req.body
    await Task.create({
        title: title,
        description: description
    })
}
