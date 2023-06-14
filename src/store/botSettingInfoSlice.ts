import { IBotSettingModel } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IBotSettingInfo {
  botSettingInfo?: IBotSettingModel;
}

const initialState: IBotSettingInfo = {};

export const botSettingInfoSlice = createSlice({
  name: 'botSettingInfo',
  initialState,
  reducers: {
    setBotSettingInfo: (state, action: PayloadAction<IBotSettingModel | undefined>) => {
      state.botSettingInfo = action.payload;
    },
  },
});

export const { setBotSettingInfo } = botSettingInfoSlice.actions;
export default botSettingInfoSlice.reducer;
