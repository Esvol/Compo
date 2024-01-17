import { Comment } from "../slices/project";
import { api } from "./api";

export const commentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createComment: builder.mutation<Comment, {text: string, projectId?: string, vacancyId?: string}>({
            query: (commentData) => ({
                url: `/user/create-comment`,
                method: "POST",
                body: commentData
            }),
            invalidatesTags: (res, err, commentData) => commentData.projectId !== undefined ? ['SingleProject'] : ['SingleVacancy'], 
        }),
        deleteComment: builder.mutation<Comment, {commentId: string, projectId?: string, vacancyId?: string}>({
            query: (commentData) => ({
                url: `/user/remove-comment`,
                method: 'DELETE',
                body: commentData,
            }),
            invalidatesTags: (res, err, commentData) => commentData.projectId !== undefined ? ['SingleProject'] : ['SingleVacancy'], 
        })
    })
})

export const {useCreateCommentMutation, useDeleteCommentMutation} = commentApi
export const {endpoints: {createComment, deleteComment}} = commentApi