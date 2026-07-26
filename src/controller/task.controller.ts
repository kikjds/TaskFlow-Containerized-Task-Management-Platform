import { Request, Response, NextFunction } from "express";
import * as taskService from "../service/task.service.js";
import { taskSchema } from "../validator/task.validator.js";

export async function taskView(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.session.userId!;

        if (req.path === "/completed") {
            const tasks = await taskService.getAllCompletedTask(userId);
            return res.render("index", { Tasks: tasks, Completed: true });
        }

        const tasks = await taskService.getAllActiveTask(userId);
        return res.render("index", { Tasks: tasks, Completed: false });
    } catch (error) {
        next(error);
    }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
    try {
        const result = taskSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).render("Task/create", {
                Title: "Creating task",
                Message: "Invalid task data",
                Errors: result.error.issues,
                title: req.body.title,
                description: req.body.description,
                deadline: req.body.deadline
            });
        }

        await taskService.createTask(
            req.session.userId!,
            result.data.title,
            result.data.description,
            result.data.deadline
        );

        return res.redirect("/");
    } catch (error) {
        next(error);
    }
}

export async function createTaskView(req: Request, res: Response, next: NextFunction) {
    try {
        res.render("Task/create", {
            Title: "Creating task",
            Message: null,
            Errors: null,
            title: null,
            description: null,
            deadline: null
        });
    } catch (error) {
        next(error);
    }
}

export async function editTaskView(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        if (!id) {
            return res.redirect("/");
        }

        const taskId = Array.isArray(id) ? id[0] : id;
        const task = await taskService.getTaskById(taskId);

        return res.render("Task/edit", {
            Title: "Editing task",
            Message: null,
            Errors: null,
            title: task?.title,
            description: task?.description,
            deadline: task?.deadline,
            id: task?._id
        });
    } catch (error) {
        next(error);
    }
}

export async function editTask(req: Request, res: Response, next: NextFunction) {
    try {
        const result = taskSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).render("Task/edit", {
                Title: "Editing task",
                Message: "Invalid task data",
                Errors: result.error.issues,
                title: req.body.title,
                description: req.body.description,
                deadline: req.body.deadline,
                id: req.body.id
            });
        }

        await taskService.editTaskById(
            req.body.id,
            req.session.userId!,
            result.data.title,
            result.data.description,
            result.data.deadline
        );

        return res.redirect("/");
    } catch (error) {
        next(error);
    }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        if (!id) {
            return res.redirect("/");
        }

        const taskId = Array.isArray(id) ? id[0] : id;

        await taskService.deleteTaskById(taskId);

        return res.redirect("/");
    } catch (error) {
        next(error);
    }
}

export async function editTaskStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        if (!id) {
            return res.redirect("/");
        }

        const taskId = Array.isArray(id) ? id[0] : id;

        await taskService.editTaskStatusById(
            taskId,
            req.session.userId!
        );

        return res.redirect("/");
    } catch (error) {
        next(error);
    }
}