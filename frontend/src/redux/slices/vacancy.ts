import { createSlice } from "@reduxjs/toolkit"
import { Comment } from "./project"
import { vacancyApi } from "../services/vacancy"
import { UserType } from "./auth"

export type Vacancy = {
    _id: string,
    title: string,
    skills: string[],
    position: string,
    level: string,	
    aboutVacancy: string,
    requirements: string,
    contact: string,
    user: UserType,
    comments: string[] | Comment[],
    createdAt: string,
    updatedAt: string,
    viewCount: number,
}

export type SingleVacancy = Omit<Vacancy, 'comments'> & {
    comments: Comment[],
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
        .addMatcher(vacancyApi.endpoints.addVacancy.matchFulfilled, (state, action) => {
            if (state.vacancies && action.payload) {
                state.vacancies = [...state.vacancies, action.payload];
                state.vacanciesStatus = 'success';
            }
        })
        .addMatcher(vacancyApi.endpoints.updateVacancy.matchFulfilled, (state, action) => {
            if(state.vacancies && action.payload){
                state.vacancies = state.vacancies.map(vacancy => {
                    if(vacancy._id === action.payload._id){
                        vacancy = action.payload;
                    }
                    return vacancy;
                })
            }
        })
    }
})

export default vacancySlice.reducer