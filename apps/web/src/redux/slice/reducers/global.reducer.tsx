import { createSlice } from '@reduxjs/toolkit'

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    sidebarOpen: false,
    sidebarCollapsed: false,
  },
  reducers: {
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
  },
})

export const { setSidebarCollapsed, setSidebarOpen } = globalSlice.actions
