import { Router } from "express";
import { updateUser, updateUserSettingsView } from "../controller/user.controller.js";

const router = Router();

//Handle user settings page
router.get('/settings', updateUserSettingsView);

//Handle user update settings
router.post('/settings', updateUser);

export default router;