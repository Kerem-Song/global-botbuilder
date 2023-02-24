import { IArrow, IBotModel, INode, IScenarioModel } from '@models';
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
  selectedScenario?: IScenarioModel;
  basicScenarios?: IScenarioModel[];
  invalidateNodes: Record<string, boolean>;
  carouselIndex: Record<string, number>;
  clipBoard?: INode;

  // token?: string;
  // botInfo?: IBotModel;
}

const initialState: BotBuilderMaker = {
  scale: 1.0,
  isEditDrawerOpen: false,
  invalidateNodes: {},
  carouselIndex: {},
};

export const botbuilderSlice = createSlice({
  name: 'botbuilderCardType',
  initialState,
  reducers: {
    initBotBuilder: (state) => {
      state.scale = 1.0;
      state.selectedScenario = undefined;
      state.selected = undefined;
      state.isEditDrawerOpen = false;
      state.invalidateNodes = {};
      state.carouselIndex = {};
    },
    setBasicScenarios: (state, action: PayloadAction<IScenarioModel[]>) => {
      state.basicScenarios = action.payload;
    },
    setSelectedScenario: (state, action: PayloadAction<IScenarioModel | undefined>) => {
      state.selectedScenario = action.payload;
      state.selected = undefined;
      state.isEditDrawerOpen = false;
      state.invalidateNodes = {};
      state.carouselIndex = {};
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
      console.log(action.payload);
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
      const result = { ...state.invalidateNodes };
      result[id] = !isValid;
      state.invalidateNodes = result;
    },
    setCarouselIndex: (state, action: PayloadAction<{ id: string; index: number }>) => {
      const { id, index } = action.payload;
      const result = { ...state.carouselIndex };
      result[id] = index;
      state.carouselIndex = result;
    },
    setClipBoard: (state, action: PayloadAction<INode | undefined>) => {
      state.clipBoard = action.payload;
    },
  },
});

export const {
  initBotBuilder,
  setSelectedScenario,
  setBasicScenarios,
  zoomIn,
  zoomOut,
  setSelected,
  setEditDrawerToggle,
  setGuideStartNode,
  //setSesstionToken,
  //setBotInfo,
  setInvalidateNode,
  setCarouselIndex,
  setClipBoard,
} = botbuilderSlice.actions;
export default botbuilderSlice.reducer;
