import { Router } from "express";
import { createTask, createTaskView, taskView } from "../controller/task.controller.js";
const router = Router()

// Home page
router.get('/', taskView)

// Create task page
router.get('/create', createTaskView)

//Handle task create
router.post('/create', createTask)

export default router