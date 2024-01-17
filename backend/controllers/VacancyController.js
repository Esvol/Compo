import VacancyModel from "../models/Vacancy.js";

export const addVacancy = async (req, res) => {
    try {
        const {title, skills, position, level, aboutVacancy, requirements, contact} = req.body
        const userId = req.userId;

        const doc = new VacancyModel({
            title: title,
            skills: skills.replace(',', '').split(' '),
            position: position,
            level: level,
            aboutVacancy: aboutVacancy,
            requirements: requirements,
            contact: contact,
            user: userId,
        })

        const vacancy = await doc.save();

        if(!vacancy){
            return res.status(400).json({message: 'Have a problem with creating this vacancy.'})
        }
        
        res.json(vacancy)
    } catch (error) {
        console.log('Error addVacancy: ' + error);
        return res.status(400).json({message: 'Have a problem with this page, please, come later :)'})
    }
}

export const updateVacancy = async (req, res) => {
    try {
        const vacancyId = req.params.id;
        const {title, skills, position, level, aboutVacancy, requirements, contact} = req.body

        const editedVacancy = await VacancyModel.findByIdAndUpdate(vacancyId, {
            title,
            skills: skills.replace(',', '').split(' '),
            position,
            level,
            aboutVacancy,
            requirements,
            contact,
        }, 
        {new: true})

        if(!editedVacancy){
            return res.status(400).json({message: 'Have a problem with editing your vacancy.'})
        }

        res.json(editedVacancy);

    } catch (error) {
        console.log('Error updateVacancy: ' + error);
        return res.status(400).json({message: 'Have a problem with this page, please, come later :)'})
    }
}

export const removeVacancy = async (req, res) => {
    try {
        const vacancyId = req.params.id;

        const removedVacancy = await VacancyModel.findByIdAndDelete(vacancyId)

        if(!removedVacancy){
            return res.status(400).json({message: 'Have a problem with removing your vacancy.'})
        }

        res.json(removedVacancy)
    } catch (error) {
        console.log('Error removeVacancy: ' + error);
        return res.status(400).json({message: 'Have a problem with this page, please, come later :)'})
    }
}

export const getVacancy = async (req, res) => {
    try {
        const vacancyId = req.params.id;

        const vacancy = await VacancyModel.findByIdAndUpdate(
            {_id: vacancyId}, 
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
            //   .populate({
            //     path: 'projectTeam',
            //     model: 'User',
            //     select: '-createdAt -updatedAt -passwordHash'
            //     })
            .exec();

        if(!vacancy){
            return res.status(400).json({message: 'Have a problem with getting this vacancy.'})
        }

        res.json(vacancy)

    } catch (error) {
        console.log('Error getVacancy: ' + error);
        return res.status(400).json({message: 'Have a problem with this page, please, come later :)'})
    }
}

export const getAllVacancies = async (req, res) => {
    try {
        const vacancies = await VacancyModel.find().populate('user', '-passwordHash');

        if(!vacancies){
            return res.status(400).json({message: 'Have a problem with getting all vacancies.'})
        }

        res.json(vacancies)
    } catch (error) {
        console.log('Error getAllVacancies: ' + error);
        return res.status(400).json({message: 'Have a problem with this page, please, come later :)'})
    }
}

