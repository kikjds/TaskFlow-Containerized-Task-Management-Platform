import { Router } from "express";
import { registerUser, loginUser, registerView, loginView, logoutUser } from "../controller/auth.controller.js";

const router = Router();

//Handle login page
router.get('/login', loginView);

//Handle register page
router.get('/register', registerView);

//Handle user registration
router.post('/register', registerUser);

//Handle user login
router.post('/login', loginUser);

//Handle user logout
router.get('/logout', logoutUser);

export default router;