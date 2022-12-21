import { createSlice } from '@reduxjs/toolkit';

const transformOptions = {
  limitToBounds: true,
  minScale: 0.25,
  maxScale: 2,
};

export interface BotBuilderMaker {
  scale: number;
}

const initialState: BotBuilderMaker = {
  scale: 1.0,
};

export const botbuilderSlice = createSlice({
  name: 'botbuilderCardType',
  initialState,
  reducers: {
    zoomIn: (state) => {
      const scale = Math.min(state.scale + 0.25, transformOptions.maxScale);
      state.scale = scale;
    },
    zoomOut: (state) => {
      const scale = Math.max(state.scale - 0.25, transformOptions.minScale);
      state.scale = scale;
    },
  },
});

export const { zoomIn, zoomOut } = botbuilderSlice.actions;
export default botbuilderSlice.reducer;
