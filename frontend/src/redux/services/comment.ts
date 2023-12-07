import { CommentInput } from "../../components/AddComment";
import { Comment } from "../slices/project";
import { api } from "./api";

export const commentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createComment: builder.mutation<Comment, CommentInput>({
            query: (commentData) => ({
                url: '/user/create-comment/project',
                method: "POST",
                body: commentData
            }),
            invalidatesTags: ['SingleProject']
        })
    })
})

export const {useCreateCommentMutation} = commentApi
export const {endpoints: {createComment}} = commentApi