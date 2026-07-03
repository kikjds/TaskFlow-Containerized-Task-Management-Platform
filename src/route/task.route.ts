import { Router } from "express";
import { createTask, createTaskView, taskView, editTaskView, editTask, deleteTask } from "../controller/task.controller.js";
const router = Router()

// Home page
router.get('/', taskView)

// Create task page
router.get('/create', createTaskView)

// Edit task page
router.get('/edit/:id', editTaskView)

//Handle task create
router.post('/create', createTask)

//Handle task edit
router.post('/edit/:id', editTask)

//Handle task delete
router.get('/delete/:id', deleteTask)



export default router