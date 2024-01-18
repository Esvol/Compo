import NotificationModel from "../models/Notification.js";
import UserModel from "../models/User.js";

export const createNotification = async (req, res) => {
    try {
        const vacancyId = req.body.vacancyId;
        const appliedUserId = req.body.appliedUserId;
        const vacancyUserId = req.body.vacancyUserId;

        const appliedVacancyUser = await UserModel.findByIdAndUpdate(appliedUserId, {$push: {appliedVacancies: vacancyId}}, {new: true})

        if(!appliedVacancyUser){
            return res.status(400).json({
                message: "Failed, user that applied vacancy is not finded.",
            }) 
        } 

        const newNotification = new NotificationModel({
            appliedUser: appliedUserId,
            vacancyUser: vacancyUserId,
            vacancyId: vacancyId,
        })

        await newNotification.save()
            .then(async (createdNotification) => {
                const savedNotification = await UserModel.findByIdAndUpdate(vacancyUserId, {$push: {notifications: createdNotification._id}}, {new: true})

                if(!savedNotification){
                    return res.status(400).json({
                        message: "Failed, notification was not saved to the vacancy user.",
                    })
                }
 
                res.send(createdNotification);
            })
            .catch(error => {
                console.log(error);
                res.status(404).json({
                    message: "Failed, notification was not  not saved to the vacancy user: " + error,
                })
            })

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}

export const removeNotification = async (req, res) => {
    try {
        const notificationId = req.body._id;
        const vacancyUserId = req.body.vacancyUserId;
        const appliedUserId = req.body.appliedUserId;
        const vacancyId = req.body.vacancyId;

        const deletedNotification = await NotificationModel.findByIdAndDelete(notificationId)

        if(!deletedNotification){
            return res.status(400).json({
                message: "Failed, notification was not deleted.",
            })
        }

        const deletedFromAppliedUser = await UserModel.findByIdAndUpdate(appliedUserId, {$pull: {appliedVacancies: vacancyId}}, {new: true})

        if(!deletedFromAppliedUser){
            return res.status(400).json({
                message: "Failed, notification was not deleted from applied user.",
            })
        }

        const deletedFromVacancyUser = await UserModel.findByIdAndUpdate(vacancyUserId, {$pull: {notifications: notificationId}}, {new: true})

        if(!deletedFromVacancyUser){
            return res.status(400).json({
                message: "Failed, notification was not deleted from vacancy user.",
            })
        }

        res.send(deletedNotification);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}