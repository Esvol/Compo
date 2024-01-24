import { Notification } from "../slices/auth";
import { api } from "./api";

export const notificationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createNotification: builder.mutation<Notification, {appliedUserId: string, vacancyId: string, vacancyUserId: string}>({
            query: (data) => ({
                url: '/user/create-notification',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        updateNotification: builder.mutation<Notification, {vacancyUserId: string, appliedUserId: string, _id: string, text: string}>({
            query: (data) => ({
                url: '/user/update-notification',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        removeNotification: builder.mutation<void, {appliedUserId: string, _id: string}>({
            query: (data) => ({
                url: '/user/remove-notification',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    })
})

export const {useCreateNotificationMutation, useRemoveNotificationMutation, useUpdateNotificationMutation} = notificationApi;

export const {endpoints: {createNotification, removeNotification, updateNotification}} = notificationApi;