import { IArrow, INode, IScenarioModel } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const transformOptions = {
  scaleFactor: 0.1,
  limitToBounds: true,
  minScale: 0.2,
  maxScale: 2,
};

export interface GuideInfo {
  startId: string;
  endId?: string;
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
  isHandleCutCard?: boolean;
  isBezierMode?: boolean;
  useMovingStartPoint?: boolean;
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
    initSelectedScenario: (
      state,
      action: PayloadAction<{
        scenarios: IScenarioModel[];
        scenarioId: string | undefined;
      }>,
    ) => {
      const { scenarios, scenarioId } = action.payload;

      if (state.selectedScenario) {
        if (scenarios.find((x) => x.id === state.selectedScenario?.id)) {
          return;
        }
      }

      if (scenarioId && scenarioId !== 'start') {
        const found = scenarios.find((x) => x.id === scenarioId);
        if (found) {
          state.selectedScenario = found;
          return;
        }
      }

      state.selectedScenario = state.basicScenarios?.find((x) => x.isStartFlow);
      state.selected = undefined;
      state.isEditDrawerOpen = false;
      state.invalidateNodes = {};
      state.carouselIndex = {};
    },
    setSelectedScenario: (state, action: PayloadAction<IScenarioModel | undefined>) => {
      state.selectedScenario = action.payload;
      state.selected = undefined;
      state.isEditDrawerOpen = false;
      state.invalidateNodes = {};
      state.carouselIndex = {};
    },
    zoomIn: (state) => {
      const scale = Math.min(
        state.scale + transformOptions.scaleFactor,
        transformOptions.maxScale,
      );

      state.scale = scale;
    },
    zoomOut: (state) => {
      const scale = Math.max(
        state.scale - transformOptions.scaleFactor,
        transformOptions.minScale,
      );

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
    setIsHandleCutCard: (state, action: PayloadAction<boolean>) => {
      state.isHandleCutCard = action.payload;
    },
    setIsBeziderMode: (state, action: PayloadAction<boolean>) => {
      state.isBezierMode = action.payload;
    },
    setUseMovingStartPoint: (state, action: PayloadAction<boolean>) => {
      state.useMovingStartPoint = action.payload;
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
  initSelectedScenario,
  setInvalidateNode,
  setCarouselIndex,
  setClipBoard,
  setIsHandleCutCard,
  setIsBeziderMode,
  setUseMovingStartPoint,
} = botbuilderSlice.actions;
export default botbuilderSlice.reducer;
