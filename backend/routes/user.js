import express from "express";

import * as ProjectController from "./../controllers/ProjectController.js";
import * as VacancyController from "./../controllers/VacancyController.js";
import * as CommentController from "./../controllers/CommentController.js";
import * as UserController from "./../controllers/UserController.js";
import * as SaveController from './../controllers/SaveController.js'
import * as NotificationController from './../controllers/NotificationController.js'

import { commentCreateValidator, loginValidator, profileValidator, projectValidator, registerValidator, vacancyValidator } from "../validator/auth.js";
import { handleErrorsValidator } from "../validator/handleErrorsValidator.js";
import { checkAuth } from "./../utils/checkAuth.js";
import { isUser } from "../utils/isUser.js";

const router = express.Router();

// USER 

/* /user/register */
router.post("/register", registerValidator, handleErrorsValidator, UserController.register)

/* /user/login */
router.post('/login', loginValidator, handleErrorsValidator, UserController.login)

/* /user/edit */
router.patch('/edit', checkAuth, isUser, profileValidator, handleErrorsValidator, UserController.edit)

/* /user/me */
router.get('/me', checkAuth, isUser, UserController.getUser)

/* /user/users */
router.get('/users', UserController.getAllUsers)

/* /user/profile/:value */
router.get('/profile/:value', UserController.getProfile)
 
  
//IT PROJECT

/* /user/add-project */
router.post("/add-project", checkAuth, isUser, projectValidator, handleErrorsValidator, ProjectController.addProject);

/* /user/projects/:id */
router.patch("/projects/:id", checkAuth, isUser, projectValidator, handleErrorsValidator, ProjectController.updateProject);

/* /user/projects/:id */ 
router.delete("/projects/:id", checkAuth, isUser, ProjectController.removeProject);


// VACANCIES

/* /user/add-vacancy */
router.post('/add-vacancy', checkAuth, isUser, vacancyValidator, handleErrorsValidator, VacancyController.addVacancy);

/* /user/vacancies/:id */
router.patch('/vacancies/:id', checkAuth, isUser, vacancyValidator, handleErrorsValidator, VacancyController.updateVacancy)

/* /user/vacancies/:id */
router.delete('/vacancies/:id', checkAuth, isUser, VacancyController.removeVacancy)


// COMMENTS

/* /user/create-comment/:value */
router.post("/create-comment", checkAuth, isUser, commentCreateValidator, handleErrorsValidator, CommentController.createComment); // value should be "project" or "vacancy"!!!

/* /user/remove-comment/:value */
router.delete("/remove-comment", checkAuth, isUser, CommentController.removeComment);


// SAVE FUNCTIONS

/* /user/save-post */
router.patch('/save-post', checkAuth, isUser, SaveController.savePost)

/* /user/unsave-post */
router.patch('/unsave-post', checkAuth, isUser, SaveController.unsavePost)

 
// NOTIFICATIONS

/* /user/create-notification */
router.post('/create-notification', checkAuth, isUser, NotificationController.createNotification)

/* /user/remove-notification */
router.delete('/remove-notification', checkAuth, isUser, NotificationController.removeNotification)

/* /user/update-notification */
router.patch('/update-notification', checkAuth, isUser, NotificationController.updateNotification)

export default router;  