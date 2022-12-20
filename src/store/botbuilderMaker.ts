import { INodeProps } from '@components/data-display/Node';
import { IBotBuilderCardType } from '@models/interfaces/ICard';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IBotBuilderCardType = {
  cardType: 'text',
};

export const botbuilderCardSlice = createSlice({
  name: 'botbuilderCardType',
  initialState,
  reducers: {
    setBotBuilderCardType: (state, action: PayloadAction<IBotBuilderCardType>) => {
      const { cardType } = action.payload;

      state.cardType = cardType;
    },
  },
});

export const { setBotBuilderCardType } = botbuilderCardSlice.actions;
export default botbuilderCardSlice.reducer;
