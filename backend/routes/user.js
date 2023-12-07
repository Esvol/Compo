import express from "express";

import * as ProjectController from "./../controllers/ProjectController.js";
import * as CommentController from "./../controllers/CommentController.js";
import * as UserController from "./../controllers/UserController.js";

import { commentCreateValidator, loginValidator, projectValidator, registerValidator } from "../validator/auth.js";
import { handleErrorsValidator } from "../validator/handleErrorsValidator.js";
import { checkAuth } from "./../utils/checkAuth.js";

const router = express.Router();

// USER 

/* /user/register */
router.post("/register", registerValidator, handleErrorsValidator, UserController.register)

/* /user/login */
router.post('/login', loginValidator, handleErrorsValidator, UserController.login)

/* /user/me */
router.get('/me', checkAuth, UserController.getUser)

 
//IT PROJECT

/* /user/create-project */
router.post("/create-project", checkAuth, projectValidator, handleErrorsValidator, ProjectController.createProject);

/* /user/projects/:id */
router.patch("/projects/:id", checkAuth, projectValidator, handleErrorsValidator, ProjectController.updateProject);

/* /user/projects/:id */
router.delete("/projects/:id", checkAuth, ProjectController.removeProject);

/* /user/create-comment/:value */
router.post("/create-comment/:value", checkAuth, commentCreateValidator, handleErrorsValidator, CommentController.createComment); // value should be "project" or "vacancy"!!!

/* /user/remove-comment/:value */
router.delete("/remove-comment/:value", checkAuth, CommentController.removeComment);


export default router;