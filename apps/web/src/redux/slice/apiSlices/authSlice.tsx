import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { BASE_URL } from '../../../constants'

export const anthSlice = createApi({
  reducerPath: 'anthSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ['Post', 'Put'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userData) => ({
        url: '/auth/login',
        method: 'POST',
        body: userData,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ password, token }: { password: string; token: string }) => ({
        url: '/auth/resetPassword',
        method: 'POST',
        body: {
          password,
        },
        headers: {
          'x-auth-token': token,
        },
      }),
    }),
    verifyEmail: builder.query({
      query: (token) => ({
        url: '/auth/verify',
        headers: {
          'x-auth-token': token,
        },
      }),
    }),
  }),
})

export const { useLoginMutation, useResetPasswordMutation, useVerifyEmailQuery } = anthSlice
