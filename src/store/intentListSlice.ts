import { ISearchIntent } from '@models/interfaces/IUtterance';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IIntentList {
  intentList: ISearchIntent[];
}

const initialState: IIntentList = { intentList: [] };

export const IntentListSlice = createSlice({
  name: 'intentList',
  initialState,
  reducers: {
    setIntentListData: (state, action: PayloadAction<ISearchIntent[]>) => {
      const item = action.payload;
      state.intentList = [...state.intentList, ...item];
    },
  },
});

export const { setIntentListData } = IntentListSlice.actions;
export default IntentListSlice.reducer;
