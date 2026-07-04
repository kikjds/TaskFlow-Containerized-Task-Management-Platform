import { Router } from "express";
import { createTask, createTaskView, taskView, editTaskView, editTask, deleteTask } from "../controller/task.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = Router()

// Home page
router.get('/', authMiddleware, taskView)

// Create task page
router.get('/create', authMiddleware, createTaskView)

// Edit task page
router.get('/edit/:id', authMiddleware, editTaskView)

//Handle task create
router.post('/create', authMiddleware, createTask)

//Handle task edit
router.post('/edit/:id', authMiddleware, editTask)

//Handle task delete
router.get('/delete/:id', authMiddleware, deleteTask)



export default router