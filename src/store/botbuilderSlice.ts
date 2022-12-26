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
  guideStart?: string;
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
    setGuideStartNode: (state, action: PayloadAction<string | undefined>) => {
      state.guideStart = action.payload;
    },
    // setGuidePosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
    //   const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
    //   const cr = canvas?.getBoundingClientRect() || new DOMRect();
    //   const newPosition = {
    //     x: action.payload.x - cr.x - 10,
    //     y: action.payload.y - cr.y - 10,
    //   };

    //   if (state.guide.x === newPosition.x && state.guide.y === newPosition.y) {
    //     return;
    //   }
    //   state.guide.x = newPosition.x;
    //   state.guide.y = newPosition.y;
    // },
  },
});

export const {
  zoomIn,
  zoomOut,
  setSelected,
  setEditDrawerToggle,
  setGuideStartNode,
  // setGuidePosition,
} = botbuilderSlice.actions;
export default botbuilderSlice.reducer;
