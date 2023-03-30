import { IResponseHistoryItem } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IHistoryInfo {
  historyInfo?: IResponseHistoryItem;
  historyYearSelector: IReactSelect[];
}

interface IReactSelect {
  value: string | null;
  label: string;
}
const initialState: IHistoryInfo = {
  historyInfo: undefined,
  historyYearSelector: [],
};

export const historyInfoSlice = createSlice({
  name: 'historyInfo',
  initialState,
  reducers: {
    setHistoryInfo: (state, action: PayloadAction<IResponseHistoryItem | undefined>) => {
      console.log('@action', action.payload);
      state.historyInfo = action.payload;
    },
    setHistoryYearSelector: (state, action: PayloadAction<IReactSelect[]>) => {
      state.historyYearSelector = action.payload;
    },
  },
});

export const { setHistoryInfo, setHistoryYearSelector } = historyInfoSlice.actions;
export default historyInfoSlice.reducer;
