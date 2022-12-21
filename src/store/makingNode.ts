import { IArrow, INode } from '@models';
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

export interface IBuilderInfo {
  nodes: INode[];
  arrows: IArrow[];
  selected?: INode | IArrow;
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
    removeItem: (state, action: PayloadAction<IArrow | string | undefined>) => {
      if (typeof action.payload === 'string') {
        const nodeId = action.payload as string;
        if (nodeId) {
          const found = state.nodes.find((x) => x.id === nodeId);

          if (!found) {
            return;
          }

          const index = state.nodes.indexOf(found);
          const nodes = [...state.nodes];
          nodes.splice(index, 1);
          state.nodes = nodes;

          const removeArrows = state.arrows.filter(
            (x) => x.start === `node-${nodeId}` || x.end === `node-${nodeId}`,
          );

          if (removeArrows.length) {
            const arrows = [...state.arrows];
            removeArrows.forEach((arrow) => {
              const index = arrows.indexOf(arrow);
              arrows.splice(index, 1);
            });
            state.arrows = arrows;
          }
        }
      } else {
        const arrow = action.payload as IArrow;
        if (arrow) {
          const found = state.arrows.find(
            (x) => x.start === arrow.start && x.end === arrow.end,
          );

          if (!found) {
            return;
          }

          const index = state.arrows.indexOf(found);
          const arrows = [...state.arrows];
          arrows.splice(index, 1);
          state.arrows = arrows;
        }
      }
    },
    setTempCard: (state, action: PayloadAction<IBuilderInfo>) => {
      const { nodes } = action.payload;
      state.nodes = state.nodes.concat(nodes);
      console.log('test arr in making card slice', state.nodes);
    },
  },
});

export const { appendNode, updateNode, addArrow, removeItem, setTempCard } =
  makingNodeSlice.actions;
export default makingNodeSlice.reducer;
