import { Queue } from 'bullmq'
import redisClient from './redis.js'

const queue = new Queue('notify', { connection: redisClient })

export default queue