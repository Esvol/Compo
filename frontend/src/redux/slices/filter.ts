import { createSlice } from "@reduxjs/toolkit"

type Filter = {
    page: 'Projects' | 'Vacancies',
    filter: string,
    currentStage: string,
    currentTag: string,
    search: string,
    currentSkill: string,
    currentLevel: string,
    currentPosition: string,
    verification: boolean
}

const initialState: Filter = {
    page: 'Projects',
    filter: 'newest',
    currentStage: 'All stages',
    currentTag: '',
    search: '',
    currentSkill: '',
    currentLevel: 'All levels',
    currentPosition: 'All positions',
    verification: false,
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setVerification: (state, action) => {
            state.verification = action.payload;
        },
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        setCurrentStage: (state, action) => {
            state.currentStage = action.payload;
        },
        setCurrentTag: (state, action) => {
            state.currentTag = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setCurrentSkill: (state, action) => {
            state.currentSkill = action.payload;
        },
        setCurrentLevel: (state, action) => {
            state.currentLevel = action.payload;
        },
        setCurrentPosition: (state, action) => {
            state.currentPosition = action.payload;
        },
    }
})

export const { setPage, setFilter, setCurrentStage, setCurrentTag, setSearch, setCurrentSkill, setCurrentLevel, setCurrentPosition, setVerification} = filterSlice.actions;

export default filterSlice.reducer;