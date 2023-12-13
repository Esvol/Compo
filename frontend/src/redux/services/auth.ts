import { api } from "./api";
import {FormDataLogin} from '../../pages/dashboard/login'
import {FormRegisterData} from '../../pages/user/registration'
import { UserType } from "../slices/auth";
import { EditType } from "../../pages/user/Profile";

type UserData = FormRegisterData & {_id: string, token: string};

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<UserData, FormDataLogin>({
            query: (userData) => ({
                url: '/user/login',
                method: 'POST',
                body: userData,
            })
        }),
        register: builder.mutation<UserData, FormRegisterData>({
            query: (userData) => ({
                url: '/user/register',
                method: "POST",
                body: userData,
            })
        }),
        current: builder.query<UserData, void>({
            query: () => ({
                url: '/user/me',
                method: 'GET'
            }),
            providesTags: ['User']
        }),
        edit: builder.mutation<UserType, EditType>({
            query: (editData) => ({
                url: `/user/edit`,
                method: 'PATCH',
                body: editData,
            }),
            invalidatesTags: ['User']
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useEditMutation, useCurrentQuery} = authApi

export const { endpoints: {login, register, edit, current} } = authApi