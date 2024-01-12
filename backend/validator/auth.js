import { body } from "express-validator";

export const registerValidator = [
    body("nickname", "Nickname must be at least 2 symbols!").trim().isString().isLength({ min: 2 }),
    body("email", "Email must be valid!").trim().isEmail(),
    body("password", "Password must be at least 4 symbols!").trim().isLength({ min: 4 }),
];

export const loginValidator = [
    body("email", "Email must be valid!").trim().isEmail(),
    body("password", "Password must be at least 4 symbols!").trim().isLength({ min: 4 }),
];

export const profileValidator = [
    body("email", "Email must be valid!").trim().isEmail(),
    body("nickname", "Nickname must be at least 2 symbols!").trim().isString().isLength({ min: 2 }),
];

export const projectValidator = [
    // body("title", "Title must be at least 1 symbol!").trim().isString().isLength({ min: 1 }),
    body("idea", "Idea must be at least 4 symbols!").trim().isString().isLength({ min: 4 }),
    body("text", "Text must be at least 10 symbols!").trim().isString().isLength({ min: 10 }),
    body("stage", "Stage is required!").trim().isString(),
    body("price", "Price must be written!").trim().isFloat(),
    body("contact", "Contact is required (must be an email)!").trim().isEmail(),
    body("preorder", "Preorder is required!").isBoolean(),
];

export const vacancyValidator = [
    // body("title", "Title must be at least 1 symbol!").trim().isString().isLength({ min: 1 }),
    body("skills", "There must be at least 1 skill!").trim().isString().isLength({ min: 1 }),
    body("position", "You need to set position").trim().isString().isLength({min: 1}),
    body("level", "You need to set level").trim().isString().isLength({min: 1}),
    body("aboutVacancy", "Vacancy inforamtion must be at least 10 symbols!").trim().isString().isLength({ min: 10 }),
    body("requirements", "Requirements text must be at least 10 symbols!").trim().isString().isLength({ min: 10 }),
    body("contact", "Contact is required (must be an email)!").trim().isEmail(),
] 

 
export const commentCreateValidator = [
    body("text", "Text must be at least 1 symbol!").trim().isString().isLength({ min: 1 }),
];