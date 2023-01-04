import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBrandInfo } from '../models/interfaces/IBrandInfo';

const initialState: IBrandInfo = {
  brandName: '루나소프트',
  brandId: 'lunasoft',
};

export const BrandInfoSlice = createSlice({
  name: 'brandInfo',
  initialState,
  reducers: {
    setBrandInfo: (state, action: PayloadAction<IBrandInfo>) => {
      const { brandName, brandId } = action.payload;
      state.brandName = brandName;
      state.brandId = brandId;
    },
  },
});

export const { setBrandInfo } = BrandInfoSlice.actions;
export default BrandInfoSlice.reducer;
