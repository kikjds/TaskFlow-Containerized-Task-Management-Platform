import { Task } from "../model/task.model.js";
import { User } from "../model/user.model.js";
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

async function createTaskReminders(
    taskId: string,
    userId: string,
    deadline: Date
) {
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

export async function getAllActiveTask(userId: string) {
    const user = await User.findById(userId).populate({
        path: "tasks",
        match: {
            isCompleted: false
        }
    });

    return user?.tasks;
}

export async function getAllCompletedTask(userId: string) {
    const user = await User.findById(userId).populate({
        path: "tasks",
        match: {
            isCompleted: true
        }
    });

    return user?.tasks;
}

export async function createTask(
    userId: string,
    title: string,
    description: string | undefined,
    deadline: string
) {
    const task = await Task.create({
        title,
        description,
        deadline
    });

    const user = await User.findByIdAndUpdate(userId, {
        $push: {
            tasks: task._id
        }
    });

    if (user?.notifications) {
        await createTaskReminders(
            task._id.toString(),
            userId,
            new Date(deadline)
        );
    }

    return task;
}

export async function getTaskById(id: string) {
    return Task.findById(id);
}

export async function editTaskById(
    id: string,
    userId: string,
    title: string,
    description: string | undefined,
    deadline: string
) {
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

    return task;
}

export async function deleteTaskById(id: string) {
    await Task.findByIdAndDelete(id);
    await removeTaskReminders(id);
}

export async function editTaskStatusById(
    id: string,
    userId: string
) {
    const task = await Task.findById(id);
    const user = await User.findById(userId);

    if (!task) {
        return;
    }

    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
        await removeTaskReminders(id);
    } else if (user?.notifications) {
        await createTaskReminders(
            id,
            userId,
            new Date(task.deadline)
        );
    }

    await task.save();
}