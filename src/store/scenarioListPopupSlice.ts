import { IScenarioModel } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IScenarioListPopup {
  token?: string;
  scenarioName: string;
  isOpen: boolean;
  item?: IScenarioModel;
  popupType: 'create' | 'rename' | 'duplicate';
}

const initialState: IScenarioListPopup = {
  isOpen: false,
  scenarioName: '',
  popupType: 'create',
};

export const scenarioListPopupSlice = createSlice({
  name: 'scenarioPopup',
  initialState: initialState,
  reducers: {
    setScenarioPopupOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setScenarioListItem: (state, action: PayloadAction<IScenarioModel>) => {
      state.item = action.payload;
    },
    setPopupType: (state, action: PayloadAction<IScenarioListPopup['popupType']>) => {
      state.popupType = action.payload;
    },
  },
});

export const { setScenarioPopupOpen, setScenarioListItem, setPopupType } =
  scenarioListPopupSlice.actions;

export default scenarioListPopupSlice.reducer;
