import { IArrow, INode } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const transformOptions = {
  limitToBounds: true,
  minScale: 0.25,
  maxScale: 2,
};

export interface BotBuilderMaker {
  scale: number;
  selected?: string | IArrow;
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
    setSelected: (state, action: PayloadAction<string | IArrow | undefined>) => {
      state.selected = action.payload;
    },
  },
});

export const { zoomIn, zoomOut, setSelected } = botbuilderSlice.actions;
export default botbuilderSlice.reducer;
