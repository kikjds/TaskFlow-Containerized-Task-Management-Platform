import { createClient  } from 'redis'

const client = await createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
}).on("error", (error) => console.log("Redis Client Error ", error)).connect()

export default client

