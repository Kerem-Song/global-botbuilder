import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITesterDataType } from './../models/interfaces/IBotTester';

interface ITesterInfo {
  messages: ITesterDataType[];
}

const initialState: ITesterInfo = { messages: [] };

export const BotTesterSlice = createSlice({
  name: 'botTester',
  initialState,
  reducers: {
    setTesterData: (state, action: PayloadAction<ITesterDataType[]>) => {
      const item = action.payload;
      state.messages = [...state.messages, ...item];
    },
    initMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setTesterData, initMessages } = BotTesterSlice.actions;
export default BotTesterSlice.reducer;
