import { api } from "./api";
import {FormDataLogin} from '../../pages/dashboard/login'
import {FormRegisterData} from '../../pages/user/registration'

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
            })
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useCurrentQuery} = authApi

export const { endpoints: {login, register, current} } = authApi