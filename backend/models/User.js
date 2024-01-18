import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    level: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
        unique: true,
    },
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    }],
    appliedVacancies: [{
        unique: true,
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacancy',
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
        required: true,
    }],
    avatarURL: {
        type: String,
        default: '',
    },
    role: {
        type: Number,
        default: 0,
    }
},
{
    timestamps: true,
})

export default mongoose.model('User', UserSchema)