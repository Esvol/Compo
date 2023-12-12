import UserModel from "../models/User.js";

export const savePost = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const userId = req.userId;

        const user = await UserModel.findByIdAndUpdate(userId, {$push: {savedPosts: projectId}}, {new: true});

        if(!user || !projectId){
            return res.status(401).json('There is a problem to save the post you choose');
        }

        res.json({projectId})

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with saving the post...', error})
    }
} 

export const unsavePost = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const userId = req.userId;

        const user = await UserModel.findByIdAndUpdate(userId, {$pull: {savedPosts: projectId}}, {new: true})
        
        if(!user || !projectId){
            return res.status(401).json('There is a problem to unsave the post you choose');
        }

        res.json({projectId})

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with unsaving the post...', error})
    }
}