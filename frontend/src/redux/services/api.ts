import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/',
    prepareHeaders (headers, {getState}) {
        const token = (getState() as RootState).auth.data?.token || localStorage.getItem('token');
 
        if (token && token !== null){
            headers.set('authorization', token);
        }
    }
})

const baseQueryWithRetry = retry(baseQuery, {maxRetries: 1});

export const api = createApi({
  reducerPath: 'sliceApi',
  baseQuery: baseQueryWithRetry,
  refetchOnMountOrArgChange: true,
  tagTypes: ['Projects', 'SingleProject', 'Comment'],
  endpoints: () => ({}),
})
