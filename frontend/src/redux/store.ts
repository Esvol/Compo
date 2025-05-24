import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/auth';
import { api } from './services/api';
import { listenerLoginMiddeware, listenerRegisterMiddeware } from './middleware/auth';
import filter from './slices/filter'
import project from './slices/project'
import vacancy from './slices/vacancy';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth,
    filter,
    project,
    vacancy,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).prepend(listenerLoginMiddeware.middleware).prepend(listenerRegisterMiddeware.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch