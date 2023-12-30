import express from "express";

import * as ProjectController from "./../controllers/ProjectController.js";
import * as CommentController from "./../controllers/CommentController.js";
import * as UserController from "./../controllers/UserController.js";
import * as SaveController from './../controllers/SaveController.js'

import { commentCreateValidator, loginValidator, profileValidator, projectValidator, registerValidator } from "../validator/auth.js";
import { handleErrorsValidator } from "../validator/handleErrorsValidator.js";
import { checkAuth } from "./../utils/checkAuth.js";

const router = express.Router();

// USER 

/* /user/register */
router.post("/register", registerValidator, handleErrorsValidator, UserController.register)

/* /user/login */
router.post('/login', loginValidator, handleErrorsValidator, UserController.login)

/* /user/edit */
router.patch('/edit', checkAuth, profileValidator, handleErrorsValidator, UserController.edit)

/* /user/me */
router.get('/me', checkAuth, UserController.getUser)

/* /user/users */
router.get('/users', UserController.getAllUsers)

/* /user/profile/:value */
router.get('/profile/:value', UserController.getProfile)
 
  

//IT PROJECT

/* /user/add-project */
router.post("/add-project", checkAuth, projectValidator, handleErrorsValidator, ProjectController.addProject);

/* /user/projects/:id */
router.patch("/projects/:id", checkAuth, projectValidator, handleErrorsValidator, ProjectController.updateProject);

/* /user/projects/:id */ 
router.delete("/projects/:id", checkAuth, ProjectController.removeProject);

/* /user/create-comment/:value */
router.post("/create-comment/:value", checkAuth, commentCreateValidator, handleErrorsValidator, CommentController.createComment); // value should be "project" or "vacancy"!!!

/* /user/remove-comment/:value */
router.delete("/remove-comment/:value", checkAuth, CommentController.removeComment);

/* /user/save-project */
router.patch('/save-project', checkAuth, SaveController.savePost)

/* /user/unsave-project */
router.patch('/unsave-project', checkAuth, SaveController.unsavePost)

export default router;  