import mongoose from "mongoose";

// schema
const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: function() {
            return !this.vacancyId; // if vacancyId is not in set
        },
    },
    vacancyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vacancy',
        required: function() {
            return !this.projectId; // if projectId is not in set
        },
    },
},
{
    timestamps: true,
})

export default mongoose.model('Comment', CommentSchema);