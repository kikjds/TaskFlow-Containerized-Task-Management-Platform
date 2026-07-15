import { Worker } from "bullmq";
import redisClient from "../lib/redis.js"

new Worker('notify', async (job) => {
    const taskId = job.data.taskId
    const userId = job.data.userId
    console.log(userId)

}, {connection: redisClient})
