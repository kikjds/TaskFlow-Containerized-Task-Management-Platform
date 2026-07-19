import { Task } from "../model/task.model.js";
import { User } from "../model/user.model.js";
import { Request, Response } from "express";
import queue from "../lib/queue.js";

const reminders = [
    7 * 24 * 60 * 60 * 1000,
    3 * 24 * 60 * 60 * 1000,
    24 * 60 * 60 * 1000,
    5 * 60 * 60 * 1000,
];

async function removeTaskReminders(taskId: string) {
    for (const time of reminders) {
        const job = await queue.getJob(`${taskId}-${time}`);
        if (job) {
            await job.remove();
        }
    }
}

async function createTaskReminders(taskId: string, userId: string | undefined, deadline: Date) {
    if (!userId) {
        throw new Error('User ID is undefined for task ' + taskId);
    }
    for (const time of reminders) {
        const delay = deadline.getTime() - Date.now() - time;

        if (delay > 0) {
            await queue.add(
                "notify",
                {
                    taskId,
                    userId
                },
                {
                    jobId: `${taskId}-${time}`,
                    attempts: 3,
                    removeOnComplete: true,
                    delay
                }
            );
        }
    }
}

export async function getAllActiveTask(req: Request, res: Response) {
    try {
        const userId = req.session.userId;

        const user = await User.findById(userId).populate({
            path: "tasks",
            match: { isCompleted: false }
        });

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
            match: { isCompleted: true }
        });

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

        if (user?.notifications) {
            await createTaskReminders(
                task._id.toString(),
                userId,
                new Date(deadline)
            );
        }

        return;
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
            {
                title,
                description,
                deadline
            },
            {
                new: true
            }
        );

        const user = await User.findById(userId);

        if (task && !task.isCompleted && user?.notifications) {
            await removeTaskReminders(id);

            await createTaskReminders(
                id,
                userId,
                new Date(deadline)
            );
        }

        return;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteTaskById(id: string) {
    try {
        await Task.findByIdAndDelete(id);
        await removeTaskReminders(id);
    } catch (error) {
        console.log(error);
    }
}

export async function editTaskStatusById(req: Request, res: Response) {
    try {
        const userId = req.session.userId;
        const id = req.params.id;
        const taskId = Array.isArray(id) ? id[0] : id;

        if (!id) return res.redirect("/");

        const task = await Task.findById(taskId);
        const user = await User.findById(userId);

        if (task) {
            task.isCompleted = !task.isCompleted;

            if (task.isCompleted) {
                await removeTaskReminders(taskId);
            } else if (user?.notifications) {
                await createTaskReminders(
                    taskId,
                    userId,
                    new Date(task.deadline)
                );
            }

            await task.save();
        }
    } catch (error) {
        console.log(error);
    }
}