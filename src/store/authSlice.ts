import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAuthModel } from '../models/interfaces/IAuthModel';

const initialState: IAuthModel = {};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<Pick<IAuthModel, 'refreshToken'>>) => {
      const { refreshToken } = action.payload;
      state.refreshToken = refreshToken;
    },
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
