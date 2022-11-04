import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBrandInfo } from '../models/interfaces/IBrandInfo';

const initialState: IBrandInfo = {
  brandName: '루나소프트',
};

export const BrandInfoSlice = createSlice({
  name: 'sidebarStatus',
  initialState,
  reducers: {
    setBrandInfo: (state, action: PayloadAction<IBrandInfo>) => {
      const { brandName } = action.payload;
      state.brandName = brandName;
    },
  },
});

export const { setBrandInfo } = BrandInfoSlice.actions;
export default BrandInfoSlice.reducer;
