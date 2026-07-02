import express from "express"
import taskRouter from "./route/task.route.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false, limit: '1mb', parameterLimit: 5000}))
app.set('view engine', 'ejs')

//Routes
app.use(taskRouter)

export default app