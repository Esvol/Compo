import { createSlice } from "@reduxjs/toolkit"

type Filter = {
    filter: string,
    language: string,
    search: string,
}

const initialState: Filter = {
    filter: 'newest',
    language: 'all',
    search: ''
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
    }
})

export const { setFilter, setLanguage, setSearch } = filterSlice.actions;

export default filterSlice.reducer;