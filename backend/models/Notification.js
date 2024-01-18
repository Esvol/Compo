import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    appliedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vacancyUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vacancyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacancy',
        required: true,
    },
},
{
    timestamps: true,
})

export default mongoose.model('Notification', NotificationSchema);