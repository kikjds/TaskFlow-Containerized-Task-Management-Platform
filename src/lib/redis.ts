import { Redis } from 'ioredis';
import 'dotenv/config';

const client = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null
});

export default client;