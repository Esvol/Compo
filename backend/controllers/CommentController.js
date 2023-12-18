import CommentModel from "../models/Comment.js";
import ProjectModel from "../models/Project.js";
import VacancyModel from "../models/Vacancy.js";

export const createComment = async (req, res) => {
    try {
        const category = req.params.value;
        const projectId = req.body.projectId;
        const userId = req.userId;

        const newComment = new CommentModel({
            text: req.body.text,
            user: userId,
            [category === "project" ? 'projectId' : 'vacancyId']: projectId,
        }) 

        console.log(newComment); 

        await newComment.save().then(async (savedComment) => {
            const ModelToUse = category === "project" ? ProjectModel : VacancyModel

            await ModelToUse.findByIdAndUpdate(projectId, {$push: {comments: savedComment._id}}, {new: true})
            .then(async () => res.send(await CommentModel.findById(savedComment._id)))
            .catch(error => {
                console.log(error);
                res.status(404).json({
                    success: "Failed, comment is not updated in project or showed.",
                })
            })
        })
        .catch(error => {
            console.log(error);
            res.status(404).json({
                success: "Failed, comment is not created.",
            })
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}

export const removeComment = async (req, res) => {
    try {
        const category = req.params.value;
        const commentId = req.body.commentId;
        const projectId = req.body.projectId;
        
        const deletedComment = await CommentModel.findByIdAndDelete(commentId);

        if(!deletedComment){
            return res.status(400).json('Problem with delete the comment!');
        }

        const ModelToUse = category === "project" ? ProjectModel : VacancyModel;
            
        await ModelToUse.findByIdAndUpdate(projectId, {$pull : {comments: commentId}})
            .then(project => {
                if (!project) {
                    console.log('project doesn`t found.');
                    return res.status(400).json('project doesn`t found!');
                } else if (!project.comments.includes(commentId)) {
                    console.log('Comment was not deleted because it is not in this project comment`s.');
                    return res.status(400).json('Comment was not deleted because it is not in this project comment`s array!');
                }
            }) 
            .catch(error => {
                console.log(error);
                return res.status(400).json('Problem with delete the comment in the model!' + error);
            })


        res.json({message: "Success", deletedComment})

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}