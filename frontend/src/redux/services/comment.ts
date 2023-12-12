import { CommentInput } from "../../components/AddComment";
import { Comment } from "../slices/project";
import { api } from "./api";

export const commentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createComment: builder.mutation<Comment, CommentInput>({
            query: (commentData) => ({
                url: `/user/create-comment/${commentData.type}`,
                method: "POST",
                body: commentData
            }),
            invalidatesTags: (res, err, commentData) => commentData.type === 'project' ? ['SingleProject'] : [], 
        }),
        deleteComment: builder.mutation<Comment, {commentId: string, projectId: string, type: string}>({
            query: (commentData) => ({
                url: `/user/remove-comment/${commentData.type}`,
                method: 'DELETE',
                body: commentData,
            }),
            invalidatesTags: (res, err, commentData) => commentData.type === 'project' ? ['SingleProject'] : [], 
        })
    })
})

export const {useCreateCommentMutation, useDeleteCommentMutation} = commentApi
export const {endpoints: {createComment, deleteComment}} = commentApi