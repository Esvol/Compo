import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "") || "";

        jwt.verify(token, process.env.SECRET_JWT_KEY, function (err, decoded) {
            if (err){
                if(err.message === 'jwt expired'){
                    return res.status(400).json({ message: 'Token has expired!' });
                }
                else{
                    return res.status(400).json({message: 'Something went wrong with login... (token is empty): ' + err})
                }
            }
            req.userId = decoded.id;
        }); 
  
        next(); 
    } catch (error) {
        console.log('Something went wrong with login... (token)' + error);
        return res.status(400).json({message: 'Something went wrong with login... (token)', error})
    }
} 