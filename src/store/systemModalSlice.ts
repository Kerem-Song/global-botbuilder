import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SystemModalStatusType = {
  isOpen: boolean;
  message?: string;
  description?: string;
  confirmButton?: string;
  cancelButton?: string;
  callbackFunc?: () => void;
  cancelFunc?: () => void;
  closeFunc?: () => void;
};

const initialState: SystemModalStatusType = {
  isOpen: false,
  confirmButton: '확인',
};

export const systemModalSlice = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    systemModalOpen: (
      state,
      action: PayloadAction<Omit<SystemModalStatusType, 'isOpen'>>,
    ) => {
      const {
        message,
        description,
        confirmButton,
        cancelButton,
        callbackFunc,
        cancelFunc,
        closeFunc,
      } = action.payload;

      state.isOpen = true;
      state.message = message && message;
      state.description = description && description;
      state.confirmButton = confirmButton && confirmButton;
      state.cancelButton = cancelButton && cancelButton;
      state.callbackFunc = callbackFunc && callbackFunc;
      state.cancelFunc = cancelFunc && cancelFunc;
      state.closeFunc = closeFunc && closeFunc;
    },

    systemModalClose: (state) => {
      state.isOpen = false;
    },
  },
});

export const { systemModalOpen, systemModalClose } = systemModalSlice.actions;

export default systemModalSlice.reducer;
