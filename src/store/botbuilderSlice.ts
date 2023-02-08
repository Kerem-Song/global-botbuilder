import { IArrow, IScenarioModel } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const transformOptions = {
  limitToBounds: true,
  minScale: 0.25,
  maxScale: 2,
};

export interface GuideInfo {
  startId: string;
  nodeId?: string;
  isNext: boolean;
  type: 'blue' | 'green' | 'red' | 'yellow';
}

export interface BotBuilderMaker {
  scale: number;
  selected?: string | IArrow;
  isEditDrawerOpen: boolean;
  guideInfo?: GuideInfo;
  savedGuideInfo?: GuideInfo;
  token: string;
  selectedScenario?: IScenarioModel;
  basicScenarios?: IScenarioModel[];
  invalidateNodes: Record<string, boolean>;
}

const initialState: BotBuilderMaker = {
  scale: 1.0,
  isEditDrawerOpen: false,
  token: '',
  invalidateNodes: {},
};

export const botbuilderSlice = createSlice({
  name: 'botbuilderCardType',
  initialState,
  reducers: {
    setBasicScenarios: (state, action: PayloadAction<IScenarioModel[]>) => {
      state.basicScenarios = action.payload;
    },
    setSelectedScenario: (state, action: PayloadAction<IScenarioModel | undefined>) => {
      state.selectedScenario = action.payload;
      state.isEditDrawerOpen = false;
    },
    setSesstionToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.selectedScenario = undefined;
      state.selected = undefined;
    },
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
      } else {
        state.isEditDrawerOpen = false;
      }
    },
    setEditDrawerToggle: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload === undefined) {
        state.isEditDrawerOpen = !state.isEditDrawerOpen;
      } else {
        state.isEditDrawerOpen = action.payload;
      }
    },
    setGuideStartNode: (state, action: PayloadAction<GuideInfo | undefined>) => {
      state.guideInfo = action.payload;
      if (action.payload) {
        state.savedGuideInfo = action.payload;
      }
    },
    setInvalidateNode: (
      state,
      action: PayloadAction<{ id: string; isValid: boolean }>,
    ) => {
      const { id, isValid } = action.payload;
      console.log(action.payload);
      const result = { ...state.invalidateNodes };
      result[id] = !isValid;
      state.invalidateNodes = result;
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
  setSelectedScenario,
  setBasicScenarios,
  zoomIn,
  zoomOut,
  setSelected,
  setEditDrawerToggle,
  setGuideStartNode,
  setSesstionToken,
  setInvalidateNode,
  // setGuidePosition,
} = botbuilderSlice.actions;
export default botbuilderSlice.reducer;
