import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SystemModalStatusType = {
  modalStatus?: 'open' | 'close';
  message?: string;
  description?: string;
  confirmButton: string;
  cancelButton?: string;
  callbackFunc?: () => any;
  cancelFunc?: () => any;
};

const initialState: SystemModalStatusType = {
  modalStatus: 'close',
  confirmButton: '확인',
};

export const systemModalSlice = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    systemModalOpen: (state, action: PayloadAction<SystemModalStatusType>) => {
      const {
        message,
        description,
        confirmButton,
        cancelButton,
        callbackFunc,
        cancelFunc,
      } = action.payload;

      state.modalStatus = 'open';
      state.message = message && message;
      state.description = description && description;
      state.confirmButton = confirmButton && confirmButton;
      state.cancelButton = cancelButton && cancelButton;
      state.callbackFunc = callbackFunc && callbackFunc;
      state.cancelFunc = cancelFunc && cancelFunc;
    },

    systemModalClose: (state) => {
      state.modalStatus = 'close';
    },
  },
});

export const { systemModalOpen, systemModalClose } = systemModalSlice.actions;

export default systemModalSlice.reducer;
