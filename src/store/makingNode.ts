import { IArrow } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBasicCard, ICommerceCard } from 'src/models/interfaces/ICard';

import img from '../assets/react.svg';

const cards: IBasicCard[] = [
  {
    title: '',
    thumbnail: { imageUrl: '' },
    description: 'asdfasdfasfasdfasdfasdfasdf',
    // buttons: [{ label: '버튼1', action: 'message' }],
  },
  {
    title: 'title2',
    thumbnail: { imageUrl: img },
    description:
      '설명2asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfadfasdfasdfasdfasdfasdfasdfasdfsd',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  { title: 'title3', thumbnail: { imageUrl: img }, description: '설명3' },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },

  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
];

export const testNodes: INode[] = [
  {
    id: '1',
    title: '1번',
    x: 100,
    y: 100,
    cards: cards,
  },
  {
    id: '2',
    title: '2번',
    x: 400,
    y: 100,
    cards: cards,
  },
];

export interface INode {
  id: string;
  title?: string;
  x: number;
  y: number;
  cards?: IBasicCard[] | ICommerceCard[];
}
export interface IBuilderInfo {
  nodes: INode[];
  arrows: IArrow[];
}
const initialState: IBuilderInfo = {
  nodes: testNodes,
  arrows: [],
};

export const makingNodeSlice = createSlice({
  name: 'makingNode',
  initialState,
  reducers: {
    appendNode: (state, action: PayloadAction<INode>) => {
      const node = action.payload;
      state.nodes = [...state.nodes, node];
    },
    updateNode: (state, action: PayloadAction<INode>) => {
      const node = action.payload;
      const matched = state.nodes.find((x) => x.id === node.id);
      if (matched) {
        const nodes = [...state.nodes];
        const index = nodes.indexOf(matched);
        nodes.splice(index, 1, node);
        state.nodes = nodes;
      }
    },
    addArrow: (state, action: PayloadAction<IArrow>) => {
      const arrow = action.payload;

      if (arrow.start === arrow.end) {
        return;
      }

      if (state.arrows.find((x) => x.start === arrow.start)) {
        return;
      }

      state.arrows = [...state.arrows, arrow];
    },
    setTempCard: (state, action: PayloadAction<IBuilderInfo>) => {
      const { nodes } = action.payload;
      state.nodes = state.nodes.concat(nodes);
      console.log('test arr in making card slice', state.nodes);
    },
  },
});

export const { appendNode, updateNode, addArrow, setTempCard } = makingNodeSlice.actions;
export default makingNodeSlice.reducer;
