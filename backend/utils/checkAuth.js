import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "") || "";

        if(!token){
            return res.status(400).json({message: 'Something went wrong with login... (token is empty)'})
        }

        jwt.verify(token, process.env.SECRET_JWT_KEY, function (err, decoded) {
            if (err){
                return res.status(400).json({message: 'Something went wrong with login... (token is empty)'})
            }
            req.userId = decoded.id;
        });


        next(); 
    } catch (error) {
        console.log('Something went wrong with login... (token)' + error);
        return res.status(400).json({message: 'Something went wrong with login... (token)', error})
    }
}