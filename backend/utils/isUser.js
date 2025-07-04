// utils
export const isUser = (req, res, next) => {
    try {
        if (!req.role === 'user'){
            return res.status(400).json({message: 'You are not a user (developer).', error})
        }

        next();
    } catch (error) {
        console.log('You are not a user (developer).' + error);
        return res.status(400).json({message: 'You are not a user (developer).', error})
    }
}