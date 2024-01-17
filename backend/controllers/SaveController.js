import UserModel from "../models/User.js";

export const savePost = async (req, res) => {
    try {
        const postId = req.body.postId;
        const userId = req.userId;

        const user = await UserModel.findByIdAndUpdate(userId, {$push: {savedPosts: postId}}, {new: true});

        if(!user || !postId){
            return res.status(401).json('There is a problem to save the post you choose');
        }

        res.json({postId})

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with saving the post...', error})
    }
} 

export const unsavePost = async (req, res) => {
    try {
        const postId = req.body.postId;
        const userId = req.userId;

        const user = await UserModel.findByIdAndUpdate(userId, {$pull: {savedPosts: postId}}, {new: true})
        
        if(!user || !postId){
            return res.status(401).json('There is a problem to unsave the post you choose');
        }

        res.json({postId})

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with unsaving the post...', error})
    }
}