import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/auth';
import { api } from './services/api';
import { listenerMiddeware } from './middleware/auth';
import filter from './slices/filter'
import project from './slices/project'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth,
    filter,
    project,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).prepend(listenerMiddeware.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch