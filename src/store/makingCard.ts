import { INodeProps, Node } from '@components';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FC } from 'react';
import { IBasicCard, ICommerceCard } from 'src/models/interfaces/ICard';

export interface INode {
  id?: string | null;
  title?: string;
  cards?: IBasicCard[] | ICommerceCard[];
}

type INewCard = React.DetailedReactHTMLElement<
  {
    style: {
      position: 'absolute';
      top: number;
      left: number;
    };
  },
  HTMLElement
>;

export interface INodes {
  nodes: INode[] | INewCard;
}
const initialState = {
  nodes: [],
};

export const makingCardSlice = createSlice({
  name: 'makingCard',
  initialState,
  reducers: {
    setTempCard: (state, action: PayloadAction<INodes>) => {
      const { nodes } = action.payload;
      const test = {
        ...state.nodes,
        nodes,
      };
      console.log('test arr in making card slice', test);
    },
  },
});

export const { setTempCard } = makingCardSlice.actions;
export default makingCardSlice.reducer;
