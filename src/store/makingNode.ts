import { testNodes } from '@components/pages/scenario/BotBuilder';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBasicCard, ICommerceCard } from 'src/models/interfaces/ICard';

export interface INode {
  id?: string;
  title?: string;
  cards?: IBasicCard[] | ICommerceCard[];
}
export interface INodes {
  nodes: INode[];
}
const initialState = {
  nodes: testNodes,
  nodeLength: 0,
};

export const makingNodeSlice = createSlice({
  name: 'makingNode',
  initialState,
  reducers: {
    setTempCard: (state, action: PayloadAction<INodes>) => {
      const { nodes } = action.payload;

      state.nodes = state.nodes.concat(nodes);
      console.log('test arr in making card slice', state.nodes);
    },

    checkNodesLength: (state, action: PayloadAction<INodes>) => {
      state.nodeLength = state.nodes.length;
    },
  },
});

export const { setTempCard, checkNodesLength } = makingNodeSlice.actions;
export default makingNodeSlice.reducer;
