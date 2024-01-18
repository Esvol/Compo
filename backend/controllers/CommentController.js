import CommentModel from "../models/Comment.js";
import ProjectModel from "../models/Project.js";
import VacancyModel from "../models/Vacancy.js";

export const createComment = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const vacancyId = req.body.vacancyId;
        const userId = req.userId;

        const newComment = new CommentModel({
            text: req.body.text,
            user: userId,
            [projectId ? 'projectId' : 'vacancyId']: projectId ? projectId : vacancyId,
        }) 
 
        console.log(newComment); 

        await newComment.save().then(async (savedComment) => {
            const ModelToUse = projectId !== undefined ? ProjectModel : VacancyModel
            const id = projectId !== undefined ? projectId : vacancyId;

            await ModelToUse.findByIdAndUpdate(id, {$push: {comments: savedComment._id}}, {new: true})
            .then(async () => res.send(await CommentModel.findById(savedComment._id)))
            .catch(error => {
                console.log(error);
                res.status(404).json({
                    message: "Failed, comment is not updated in project or showed.",
                })
            })
        })
        .catch(error => {
            console.log(error);
            res.status(404).json({
                message: "Failed, comment is not created.",
            })
        })
  
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}

export const removeComment = async (req, res) => {
    try {
        const commentId = req.body.commentId;
        const projectId = req.body.projectId;
        const vacancyId = req.body.vacancyId;
        
        const deletedComment = await CommentModel.findByIdAndDelete(commentId);

        if(!deletedComment){
            return res.status(400).json('Problem with delete the comment!');
        }

        const ModelToUse = projectId !== undefined ? ProjectModel : VacancyModel;
        const id = projectId !== undefined ? projectId : vacancyId;
        console.log(ModelToUse); 
        console.log(id);

        await ModelToUse.findByIdAndUpdate(id, {$pull : {comments: commentId}})
            .then(project => {
                if (!project) {
                    console.log('Project/Vacancy doesn`t found.');
                    return res.status(400).json('Project/Vacancy doesn`t found!');
                } else if (!project.comments.includes(commentId)) {
                    console.log('Comment was not deleted because it is not in this Project/Vacancy comment`s.');
                    return res.status(400).json('Comment was not deleted because it is not in this Project/Vacancy comment`s array!');
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