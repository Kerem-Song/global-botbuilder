import { IEnterUtterance } from '@models/interfaces/IUtterance';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IUtteranceDetail {
  utterance: IEnterUtterance[];
}

const initialState: IUtteranceDetail = { utterance: [] };

export const UtteranceDetailSlice = createSlice({
  name: 'utteranceDetail',
  initialState,
  reducers: {
    setUtteranceData: (state, action: PayloadAction<IEnterUtterance[]>) => {
      const item = action.payload;
      console.log('dafdsfadfas', item);
      state.utterance = [...state.utterance, ...item];
    },
    removeUtteranceData: (state, action) => {
      const item = action.payload;
      console.log('item', item);
      state.utterance = [
        ...state.utterance.filter((utterance: IEnterUtterance) => utterance.id !== item),
      ];
    },
    initUtterance: (state) => {
      state.utterance = [];
    },
  },
});

export const { setUtteranceData, removeUtteranceData, initUtterance } =
  UtteranceDetailSlice.actions;
export default UtteranceDetailSlice.reducer;
