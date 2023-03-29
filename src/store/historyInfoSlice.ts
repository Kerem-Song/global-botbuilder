import { IResponseHistoryItem } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IHistoryInfo {
  historyInfo?: IResponseHistoryItem;
}

const initialState: IHistoryInfo = {};

export const historyInfoSlice = createSlice({
  name: 'historyInfo',
  initialState,
  reducers: {
    setHistoryInfo: (state, action: PayloadAction<IResponseHistoryItem | undefined>) => {
      console.log('@action', action.payload);
      state.historyInfo = action.payload;
    },
    // initHistoryInfo: (state) => {
    //   state = initialState;
    // },
  },
});

export const { setHistoryInfo } = historyInfoSlice.actions;
export default historyInfoSlice.reducer;
