import { Worker } from "bullmq";
import redisClient from "../lib/redis.js"
import { User } from "../model/user.model.js"

new Worker('notify', async (job) => {
    const taskId = job.data.taskId
    const userId = job.data.userId

    const email = await getUserEmail(userId)
    notifyUser(email, taskId)
}, {connection: redisClient})

async function getUserEmail(userId: string) {
    const user = await User.findById(userId)
    return user?.email
}

async function notifyUser(email: string | undefined, taskId: string) {
    if(!email) {
        throw new Error('User email not found ' + taskId)
    }
    console.log(`Sending notification to ${email} for task ${taskId}`)
}