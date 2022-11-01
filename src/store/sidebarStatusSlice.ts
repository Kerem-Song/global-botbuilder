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
  },
});

export const { setSidebarStatus } = sideBarStatusSlice.actions;
export default sideBarStatusSlice.reducer;
