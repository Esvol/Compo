import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    avatarURL: {
        type: String,
        default: '',
    },
},
{
    timestamps: true,
})

export default mongoose.model('User', UserSchema)