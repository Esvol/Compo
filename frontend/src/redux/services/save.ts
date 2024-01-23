import { api } from "./api";

export const saveApi = api.injectEndpoints({
    endpoints: (builder) => ({
        savePost: builder.mutation<{postId: string}, {postId: string}>({
            query: (data) => ({
                url: '/user/save-post',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        unsavePost: builder.mutation<{postId: string}, {postId: string}>({
            query: (data) => ({
                url: '/user/unsave-post',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        })
    })
})

export const {useSavePostMutation, useUnsavePostMutation} = saveApi;
export const {endpoints: {savePost, unsavePost}} = saveApi;