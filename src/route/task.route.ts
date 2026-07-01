import { Router } from "express";
import { createTaskView, taskView } from "../controller/task.controller.js";
const router = Router()

// Home page
router.get('/', taskView)

// Create task page
router.get('/create', createTaskView)

export default router