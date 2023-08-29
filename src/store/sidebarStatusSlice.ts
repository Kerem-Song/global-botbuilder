import { createSlice } from '@reduxjs/toolkit';

import { ISidebarStatus } from '../models/interfaces/ISidebarStatus';

const initialState: ISidebarStatus = {
  isOpen: false,
};

export const sideBarStatusSlice = createSlice({
  name: 'sidebarStatus',
  initialState,
  reducers: {
    setSidebarStatus: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSidebarClose: (state) => {
      state.isOpen = false;
    },
    setSidebarPopstate: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setSidebarStatus, setSidebarClose, setSidebarPopstate } =
  sideBarStatusSlice.actions;
export default sideBarStatusSlice.reducer;
