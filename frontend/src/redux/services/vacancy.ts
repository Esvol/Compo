import { VacancyInput } from "../../pages/user/AddVacancy";
import { Vacancy } from "../slices/vacancy";
import { api } from "./api";

export const vacancyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllVacancies: builder.query<Vacancy[], void>({
            query: () => ({
                url: '/dashboard/vacancies',
                method: 'GET',
            }),
            providesTags: (result) =>
            result 
                ?   [
                        ...result.map(({ _id }) => ({ type: 'Vacancies' as const, _id })), 
                        { type: 'Vacancies', id: 'ADD-VACANCY' },
                        {type: 'Vacancies', id: 'DELETE-VACANCY'}
                    ] 
                :   [{ type: 'Vacancies', id: 'ADD-VACANCY' }],
        }),
        getOneVacancy: builder.query<Vacancy, string>({
            query: (id) => ({
                url: `/dashboard/vacancies/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'SingleVacancy', id }],
        }),
        addVacancy: builder.mutation<Vacancy, VacancyInput>({
            query: (data) => ({
                url: '/user/add-vacancy',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Vacancies', id: 'ADD-VACANCY' }],
        }),
        updateVacancy: builder.mutation<Vacancy, VacancyInput & {id: string}>({
            query: (data) => ({
                url: `/user/vacancy/${data.id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, data) => [{ type: 'Vacancies', id: data.id }],
        }),
        deleteVacancy: builder.mutation<Vacancy, string>({
            query: (id) => ({
                url: `/user/vacancy/${id}`,
                method: 'DELETE',
                // body: id,
            }),
            invalidatesTags: [{ type: 'Vacancies', id: 'DELETE-VACANCY' }],
        }),
    })
})

export const 
{   
    useGetAllVacanciesQuery,
    useGetOneVacancyQuery,
    useAddVacancyMutation,
    useUpdateVacancyMutation,
    useDeleteVacancyMutation,
} = vacancyApi

export const 
{endpoints: 
    {   
        getAllVacancies,
        getOneVacancy,
        addVacancy,
        updateVacancy,
        deleteVacancy,
    } 
} = vacancyApi