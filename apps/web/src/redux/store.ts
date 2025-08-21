import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { anthSlice } from './slice/apiSlices/authSlice'
import { globalSlice } from './slice/reducers/global.reducer'

export const store = configureStore({
  reducer: {
    [anthSlice.reducerPath]: anthSlice.reducer,
    global: globalSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([anthSlice.middleware]),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
