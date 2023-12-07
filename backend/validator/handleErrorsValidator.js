import { validationResult } from "express-validator";

export const handleErrorsValidator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(417).json({errors: errors.array()})
    }

    next();
}