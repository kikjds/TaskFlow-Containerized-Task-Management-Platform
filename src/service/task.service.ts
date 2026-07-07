import { Task } from "../model/task.model.js";
import { User } from "../model/user.model.js";
import { Request, Response } from "express";

export async function getAllTask(req: Request, res: Response) {
    try {
        const userId = req.session.userId;

        const user = await User.findById(userId).populate("tasks");

        return user?.tasks;
    } catch (error) {
        console.error(error);
    }
}

export async function createTask(req: Request, res: Response) {
    try {
        const userId = req.session.userId;
        const { title, description, deadline } = req.body;

        const task = await Task.create({
            title,
            description,
            deadline
        });

        await User.findByIdAndUpdate(userId, {
            $push: { tasks: task._id }
        });

        return
    } catch (error) {
        console.error(error);
    }
}

export async function getTaskById(id: string) {
    return Task.findById(id);
}

export async function editTaskById(req: Request, res: Response) {
    try {
        const { title, description, deadline, id } = req.body;

        await Task.findByIdAndUpdate(
            id,
            { title, description, deadline },
            { new: true }
        );

        return
    } catch (error) {
        console.error(error);
    }
}

export async function deleteTaskById(id: string) {
    try {
        await Task.findByIdAndDelete(id);
    } catch (error) {
        console.error(error);
    }
}