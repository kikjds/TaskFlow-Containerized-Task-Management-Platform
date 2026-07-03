import { Task } from "../model/task.model.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

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

export function getTaskById(id: string) {
    return Task.findById(id)
}

export async function editTaskById(req: Request, res: Response) {
    const { title, description, id } = req.body
    await Task.updateOne({_id: new mongoose.Types.ObjectId(id)}, {title, description})
}