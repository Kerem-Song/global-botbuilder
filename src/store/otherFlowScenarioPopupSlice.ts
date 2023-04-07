import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IOtherFlowScenariosPopup {
  isOpen: boolean;
  popupPosition: {
    x: number;
    y: number;
  };
  isClickHeaderBtn?: boolean;
}
const initialState: IOtherFlowScenariosPopup = {
  isOpen: false,
  popupPosition: {
    x: 0,
    y: 0,
  },
  isClickHeaderBtn: false,
};

export const otherFlowScenariosPopupStatusSlice = createSlice({
  name: 'otherFlowScnearioPopupStatus',
  initialState: initialState,
  reducers: {
    otherFlowScenariosPopupStatus: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setOtherFlowPopupPosition: (
      state,
      action: PayloadAction<IOtherFlowScenariosPopup['popupPosition']>,
    ) => {
      state.popupPosition = action.payload;
    },
    setIsClickHeaderBtn: (state, action: PayloadAction<boolean>) => {
      state.isClickHeaderBtn = action.payload;
    },
  },
});

export const {
  otherFlowScenariosPopupStatus,
  setOtherFlowPopupPosition,
  setIsClickHeaderBtn,
} = otherFlowScenariosPopupStatusSlice.actions;

export default otherFlowScenariosPopupStatusSlice.reducer;
