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
  isEditDrawerOpen: boolean;
}

const initialState: BotBuilderMaker = {
  scale: 1.0,
  isEditDrawerOpen: false,
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
      if (typeof action.payload === 'string') {
        state.isEditDrawerOpen = true;
      }
    },
    setEditDrawerToggle: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload === undefined) {
        state.isEditDrawerOpen = !state.isEditDrawerOpen;
      } else {
        state.isEditDrawerOpen = action.payload;
      }
    },
  },
});

export const { zoomIn, zoomOut, setSelected, setEditDrawerToggle } =
  botbuilderSlice.actions;
export default botbuilderSlice.reducer;
