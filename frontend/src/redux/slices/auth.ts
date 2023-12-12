import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { authApi } from '../services/auth'

type UserType = {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  token: string,
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
      .addMatcher(authApi.endpoints.current.matchFulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'success'
      })
}
})

export const { logout } = authSlice.actions

export const selectUser = (state: RootState) => state.auth.data

export default authSlice.reducer