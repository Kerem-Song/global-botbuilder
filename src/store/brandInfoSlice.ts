import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBrandInfo } from '../models/interfaces/IBrandInfo';

const initialState: IBrandInfo = {
  brandName: '루나소프트',
  brandId: 'lunasoft',
};

export const brandInfoSlice = createSlice({
  name: 'brandInfo',
  initialState,
  reducers: {
    setBrandInfo: (state, action: PayloadAction<IBrandInfo>) => {
      const { brandName, brandId } = action.payload;
      state.brandName = brandName;
      state.brandId = brandId;
    },
    setBrandId: (state, action: PayloadAction<string>) => {
      state.brandId = action.payload;
    },
  },
});

export const { setBrandInfo, setBrandId } = brandInfoSlice.actions;
export default brandInfoSlice.reducer;
