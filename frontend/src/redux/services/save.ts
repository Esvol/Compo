import { User } from "../slices/project";
import { api } from "./api";

export const saveApi = api.injectEndpoints({
    endpoints: (builder) => ({
        saveProject: builder.mutation<{projectId: string}, {projectId: string}>({
            query: (data) => ({
                url: '/user/save-project',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        unsaveProject: builder.mutation<{projectId: string}, {projectId: string}>({
            query: (data) => ({
                url: '/user/unsave-project',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        })
    })
})

export const {useSaveProjectMutation, useUnsaveProjectMutation} = saveApi;
export const {endpoints: {saveProject, unsaveProject}} = saveApi;