import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ISaveIntent } from './../models/interfaces/IUtterance';

interface IIntent {
  intent: ISaveIntent[];
}

const initialState: IIntent = { intent: [] };

export const IntentSlice = createSlice({
  name: 'intent',
  initialState,
  reducers: {
    setIntentData: (state, action: PayloadAction<ISaveIntent[]>) => {
      const item = action.payload;
      state.intent = [...state.intent, ...item];
    },
  },
});

export const { setIntentData } = IntentSlice.actions;
export default IntentSlice.reducer;
