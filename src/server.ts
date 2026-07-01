import express from "express"
import taskROuter from "./route/task.route.js"

const app = express()
app.use(express.urlencoded({extended: false, limit: '1mb', parameterLimit: 5000}))
app.set('view engine', 'ejs')

//View routes
app.use(taskROuter)

export default app