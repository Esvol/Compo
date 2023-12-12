import mongoose from "mongoose";
import Comment from "./Comment.js";

const VacancySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    idea: {
        type: String,
        required: true,
    },
    // text: {
    //     type: String,
    //     required: true,
    // },
    // tags: {
    //     type: Array,
    //     default: [],
    // },
    // stage: {
    //     type: String,
    //     required: true,
    //     validate: {
    //         validator: function(value) {
    //             const allowedValues = ['Beginner', 'Mid-development', 'Almost finished', 'Testing', 'Finished'];
    //             return allowedValues.includes(value);
    //         },
    //         message: 'You should choose between \'Beginner\', \'Mid-development\', \'Almost finished\', \'Testing\' or \'Finished\''
    //     }
    // },
    // price: {
    //     type: Number,
    //     required: true,
    // },
    // contact: {
    //     type: String,
    //     required: true
    // },
    // preorder: {
    //     type: Boolean,
    //     required: true,
    // },
    // viewCount: {
    //     type: Number,
    //     default: 0,
    // },

    // imageURL: String,

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