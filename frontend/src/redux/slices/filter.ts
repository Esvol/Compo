import { createSlice } from "@reduxjs/toolkit"

type Filter = {
    filter: string,
    currentStage: string,
    currentTag: string,
    search: string,
}

const initialState: Filter = {
    filter: 'newest',
    currentStage: 'All stages',
    currentTag: '',
    search: '',
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
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
    }
})

export const { setFilter, setCurrentStage, setCurrentTag, setSearch } = filterSlice.actions;

export default filterSlice.reducer;