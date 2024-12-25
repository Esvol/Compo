import mongoose from "mongoose";
import Notification from "./Notification.js";

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
    position: {
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
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Notification,
        required: true,
    }],
    avatarURL: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'company'], 
        default: 'user'
    }
},
{
    timestamps: true,
})

export default mongoose.model('User', UserSchema)