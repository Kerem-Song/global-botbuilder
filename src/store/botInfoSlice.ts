import { IBotModel } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IBotInfo {
  botInfo?: IBotModel;
  token?: string;
}

const initialState: IBotInfo = {};

export const botInfoSlice = createSlice({
  name: 'botInfo',
  initialState,
  reducers: {
    setBotInfo: (state, action: PayloadAction<IBotModel | undefined>) => {
      state.botInfo = action.payload;
    },
    setSesstionToken: (state, action: PayloadAction<string | undefined>) => {
      state.token = action.payload;
    },
  },
});

export const { setBotInfo, setSesstionToken } = botInfoSlice.actions;
export default botInfoSlice.reducer;
