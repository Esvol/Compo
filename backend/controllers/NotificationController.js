import NotificationModel from "../models/Notification.js";
import UserModel from "../models/User.js";

// controller
export const createNotification = async (req, res) => {
    try {
        const vacancyId = req.body.vacancyId;
        const appliedUserId = req.body.appliedUserId;
        const vacancyUserId = req.body.vacancyUserId;

        const isNotificationExist = await NotificationModel.findOne({vacancy: vacancyId, appliedUser: appliedUserId})

        if(isNotificationExist){
            return res.status(400).json({
                message: "Failed, user is already applied this vacancy.",
            }) 
        }

        const newNotification = new NotificationModel({
            appliedUser: appliedUserId,
            vacancyUser: vacancyUserId,
            vacancy: vacancyId,
            text: '',
        })

        await newNotification.save()
            .then(async (createdNotification) => {
                const savedVacancyUserNotification = await UserModel.findByIdAndUpdate(vacancyUserId, {$push: {notifications: createdNotification._id}}, {new: true})

                if(!savedVacancyUserNotification){
                    return res.status(400).json({
                        message: "Failed, notification was not saved to the vacancy user.",
                    })
                }
 
                res.send(createdNotification);
            })
            .catch(error => {
                console.log(error);
                res.status(404).json({
                    message: "Failed, notification was not saved: " + error,
                })
            })

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}

export const updateNotification = async (req, res) => {
    try {
        const vacancyUserId = req.body.vacancyUserId;
        const appliedUserId = req.body.appliedUserId;
        const notificationId = req.body._id;
        const text = req.body.text;

        const notification = await NotificationModel.findByIdAndUpdate(notificationId, {text: text}, {new: true})

        if(!notification){
            return res.status(400).json({message: 'Notification is not found for updating!'})
        }

        const savedApplyUserNotification = await UserModel.findByIdAndUpdate(appliedUserId, {$push: {notifications: notificationId}}, {new: true})

        if(!savedApplyUserNotification){
            return res.status(400).json({
                message: "Failed, notification was not saved to the apply user.",
            })
        }

        const deleteVacancyUserNotification = await UserModel.findByIdAndUpdate(vacancyUserId, {$pull: {notifications: notificationId}}, {new: true})

        if(!deleteVacancyUserNotification){
            return res.status(400).json({
                message: "Failed, notification was not saved to the apply user.",
            })
        }

        res.json(notification)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong... updateNotification: ', error})
    }
}

export const removeNotification = async (req, res) => {
    try {
        const notificationId = req.body._id;
        const appliedUserId = req.body.appliedUserId;

        const deletedNotification = await NotificationModel.findByIdAndDelete(notificationId)

        if(!deletedNotification){
            return res.status(400).json({
                message: "Failed, notification was not deleted.",
            })
        }

        const deletedFromApplyUser = await UserModel.findByIdAndUpdate(appliedUserId, {$pull: {notifications: notificationId}}, {new: true})

        if(!deletedFromApplyUser){
            return res.status(400).json({
                message: "Failed, notification was not deleted from apply user.",
            })
        }

        res.send(deletedNotification);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong...', error})
    }
}