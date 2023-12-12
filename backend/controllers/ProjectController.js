import CommentModel from "../models/Comment.js";
import ProjectModel from "../models/Project.js";

export const addProject = async (req, res) => {
    try {
        const {title, idea, text, projectTeam, tags, stage, price, contact, preorder, imageURL} = req.body;
        console.log({title, idea, projectTeam, tags, stage, price, contact, preorder, imageURL});
        const userId = req.userId;

        const isProjectExists = await ProjectModel.findOne({title: title})

        if (isProjectExists){
            return res.status(400).json('Project with this title is already exists!');
        }

        const doc = new ProjectModel({
            title,
            idea,
            text,
            projectTeam: projectTeam ?? [],
            tags: tags.split(', ') ?? [],
            stage,
            price,
            contact,
            preorder,
            user: userId,
            imageURL: imageURL ?? ""
        })

        const project = await doc.save();

        if(!project){
            return res.status(400).json('Problem with creating the project!');
        }

        res.json(project)

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}

export const getProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await ProjectModel.findByIdAndUpdate(
            {_id: projectId}, 
            {$inc: {viewCount: 1}}, 
            {new: true})
            .populate('user', '-passwordHash')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: '-createdAt -updatedAt -passwordHash'
                }
              })
            .exec();

        if (!project){
            return res.status(400).json('Problem with getting the project!');
        }

        res.json(project);

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find().populate('user', '-passwordHash').exec();

        if (!projects){
            return res.status(400).json('Problem with getting all projects!');
        }

        res.json(projects)
    } catch (error) {
        console.log(error); 
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}

export const removeProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        await ProjectModel.findByIdAndDelete(projectId)
            .then((removedProject) => {
                removedProject.comments.map(async(comment) => {
                    await CommentModel.findByIdAndDelete(comment._id)
                        .catch(error => {
                            console.log('There was no such a comement in the deleted project: ' + error);
                        })
                })
                res.json(removedProject)
            })
            .catch(error => {
                return res.status(400).json({message: 'Can`t find the project to remove...' + error})
            })
            

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}

export const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const {title, idea, text, projectTeam, tags, stage, price, contact, preorder, imageURL} = req.body;

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            projectId, 
            {
                title,
                idea,
                text,
                projectTeam: projectTeam ?? [],
                tags: tags ?? [],
                stage,
                price,
                contact,
                preorder,
                imageURL: imageURL & ""
            }, 
            {new: true})

        if (!updatedProject){
            return res.status(400).json('Problem with updating the project!');
        }

        res.json(updatedProject);

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}