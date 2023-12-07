import express from 'express'

import * as ProjectController from "../controllers/ProjectController.js";

const router = express.Router(); 

/* /dashboard/projects/:id */
router.get("/projects/:id", ProjectController.getProject);

/* /dashboard/projects */
router.get("/projects", ProjectController.getAllProjects);

export default router; 