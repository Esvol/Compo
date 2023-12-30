import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'

import { authApi } from '../services/auth'
import { saveApi } from "../services/save"

export type UserType = {
  _id: string,
  nickname: string,
  level: 'Frontend' | 'Backend' | 'Full Stack',
  email: string,
  token?: string,
  savedPosts: string[],
  avatarURL?: string,
}

interface InitialState {
  data: UserType | null,
  status: 'loading' | 'success' | 'rejected'
}

const initialState: InitialState = {
  data: null,
  status: 'loading',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      Object.assign({data: null, status: 'loading'}, initialState);
      window.location.reload();
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'success';
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'success'
      })
      .addMatcher(authApi.endpoints.edit.matchFulfilled, (state, action) => {
        if(state.data){
          state.data = Object.assign(state.data, action.payload)
        }
      })
      .addMatcher(authApi.endpoints.current.matchFulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'success'
      })

      .addMatcher(saveApi.endpoints.saveProject.matchFulfilled, (state, action) => {
        if(action.payload && state.data){
            state.data.savedPosts = [...state.data.savedPosts, action.payload.projectId]
        }
      })
      .addMatcher(saveApi.endpoints.unsaveProject.matchFulfilled, (state, action) => {
        if(action.payload && state.data){
            state.data.savedPosts = state.data.savedPosts.filter(projectId => projectId !== action.payload.projectId)
        }
      })
}
})

export const { logout } = authSlice.actions

export const selectUser = (state: RootState) => state.auth.data

export default authSlice.reducer