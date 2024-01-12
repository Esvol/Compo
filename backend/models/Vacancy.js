import mongoose from "mongoose";
import Comment from "./Comment.js";

const VacancySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    skills: {
        type: Array,
        default: [],
    },
    position: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    aboutVacancy: {
        type: String,
        required: true,
    },
    requirements: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: Comment,
        required: true,
    }],
},
{
    timestamps: true,
})

export default mongoose.model('Vacancy', VacancySchema);