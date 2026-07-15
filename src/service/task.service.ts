import { Task } from "../model/task.model.js";
import { User } from "../model/user.model.js";
import { Request, Response } from "express";
import queue from '../lib/queue.js'

export async function getAllActiveTask(req: Request, res: Response) {
    try {
        const userId = req.session.userId;

        const user = await User.findById(userId).populate({
            path: "tasks",
            match: {isCompleted: false}
        })

        return user?.tasks;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllCompletedTask(req: Request, res: Response) {
    try {
        const userId = req.session.userId;

        const user = await User.findById(userId).populate({
            path: "tasks",
            match: {isCompleted: true}
        })

        return user?.tasks;
    } catch (error) {
        console.log(error);
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

        const user = await User.findByIdAndUpdate(userId, {
            $push: { tasks: task._id }
        });

        await queue.add('notify', { taskId: task._id }, {
            jobId: task._id.toString(),
            attempts: 3,
            removeOnComplete: true,
            delay: new Date(deadline).getTime() - Date.now(),
        });
        }

        return
    } catch (error) {
        console.log(error);
    }
}

export async function getTaskById(id: string) {
    return Task.findById(id);
}

export async function editTaskById(req: Request, res: Response) {
    try {
        const { title, description, deadline, id } = req.body;
        const userId = req.session.userId;
        const task = await Task.findByIdAndUpdate(
            id,
            { title, description, deadline },
            { new: true }
        );
        const user = await User.findById(userId);
        if (!task?.isCompleted && user?.notifications) {
            const job = await queue.getJob(id);
            if (job) {
                await job.changeDelay(new Date(deadline).getTime() - Date.now());
            }
        }
        return;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteTaskById(id: string) {
    try {
        await Task.findByIdAndDelete(id);
        const job = await queue.getJob(id);

        if (job) {
            await job.remove();
        }
    } catch (error) {
        console.log(error);
    }

}

export async function editTaskStatusById(req: Request, res: Response) {
    try {
        const userId = req.session.userId;
        const id = req.params.id;
        const taskId = Array.isArray(id) ? id[0] : id
        if(!id) return res.redirect('/')
        const task = await Task.findById(taskId);
        const user = await User.findById(userId);
        if (task) {
            task.isCompleted = !task.isCompleted;
            if(task.isCompleted) {
                const job = await queue.getJob(taskId);
                if (job) {
                    await job.remove();
                }
            } else if(user?.notifications) {
                await queue.add('notify', { taskId: task._id }, {
                    jobId: task._id.toString(),
                    attempts: 3,
                    delay: new Date(task.deadline).getTime() - Date.now(),
                });
            }
            await task.save();
        }
    } catch (error) {
        console.log(error);
    }
}