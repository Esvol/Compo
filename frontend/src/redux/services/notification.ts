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
        removeNotification: builder.mutation<void, Notification>({
            query: (data) => ({
                url: '/user/remove-notification',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    })
})

export const {useCreateNotificationMutation, useRemoveNotificationMutation} = notificationApi;

export const {endpoints: {createNotification, removeNotification}} = notificationApi;