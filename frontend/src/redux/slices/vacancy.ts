import { createSlice } from "@reduxjs/toolkit"
import { Comment, User } from "./project"
import { vacancyApi } from "../services/vacancy"

export type Vacancy = {
    _id: string,
    title: string,
    skills: string[],
    position: string,
    level: string,	
    aboutVacancy: string,
    requirements: string,
    contact: string,
    user: User,
    comments: string[] | Comment[],
    createdAt: string,
    updatedAt: string,
    viewCount: number,
}

type InitialState = {
    currentVacancy: Vacancy | null,
    ccurrentVacancyStatus: 'loading' | 'success' | 'rejected',
    vacancies: Vacancy[],
    vacanciesStatus: 'loading' | 'success' | 'rejected',
}

const initialState: InitialState = {
    currentVacancy: null,
    ccurrentVacancyStatus: 'loading',
    vacancies: [],
    vacanciesStatus: 'loading',
}

export const vacancySlice = createSlice({
    name: 'vacancy',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addMatcher(vacancyApi.endpoints.getAllVacancies.matchFulfilled, (state, action) => {
            state.vacancies = action.payload;
            state.vacanciesStatus = 'success';
        })
        .addMatcher(vacancyApi.endpoints.getAllVacancies.matchRejected, (state, action) => {
            state.vacancies = [];
            state.vacanciesStatus = 'rejected';
        })
    }
})

export default vacancySlice.reducer