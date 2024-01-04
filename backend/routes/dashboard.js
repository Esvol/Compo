import express from 'express'

import * as ProjectController from "../controllers/ProjectController.js";
import * as VacancyController from "../controllers/VacancyController.js";

const router = express.Router(); 

// IT-PROJECTS

/* /dashboard/projects/:id */
router.get("/projects/:id", ProjectController.getProject);

/* /dashboard/projects */
router.get("/projects", ProjectController.getAllProjects);


//VACANCIES

/* /dashboard/vacancies/:id */
router.get("/vacancies/:id", VacancyController.getVacancy);

/* /dashboard/vacancies */
router.get("/vacancies", VacancyController.getAllVacancies);

export default router; 