import { IArrow, INode, NodeKind } from '@models';
import { NODE_TYPES } from '@models/interfaces/ICard';
import { INodeEditModel } from '@models/interfaces/INodeEditModel';
import {
  ACTION_TYPES,
  IAnswerNode,
  IAnswerView,
  IBasicCardCarouselNode,
  IBasicCardNode,
  IBasicCardView,
  IConditionNode,
  INodeBase,
} from '@models/interfaces/res/IGetFlowRes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NEXT_BUTTON_PREFIX, NODE_PREFIX } from '../modules';
import { nodeHelper } from '../modules/nodeHelper';

export interface IBuilderInfo {
  nodes: INode[];
  arrows: IArrow[];
  selected?: INode | IArrow;
}
const initialState: IBuilderInfo = {
  nodes: [],
  arrows: [],
};

const convert = (node: INodeBase): { node: INode; arrows: IArrow[] } => {
  const result: INode = nodeHelper.convertToINode(node);
  const arrows = nodeHelper.initArrows(node);

  return { node: result, arrows };
};

export const makingNodeSlice = createSlice({
  name: 'makingNode',
  initialState,
  reducers: {
    initNodes: (state, action: PayloadAction<INodeBase[] | undefined>) => {
      const nodes = action.payload || [];
      const converted = nodes.map((x) => convert(x));
      state.nodes = converted.map((x) => x.node);
      state.arrows = [];
      converted.map((x) => (state.arrows = [...state.arrows, ...x.arrows]));
    },
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
    editNode: (state, action: PayloadAction<INodeEditModel>) => {
      const node = action.payload;
      const matched = state.nodes.find((x) => x.id === node.id);
      if (matched) {
        const nodes = [...state.nodes];
        const index = nodes.indexOf(matched);
        const old = nodes[index];
        const arrows = [...state.arrows];
        const updateArrows = nodeHelper.editArrows(node, arrows);

        if (updateArrows) {
          state.arrows = updateArrows;
        }

        nodes.splice(index, 1, { ...old, title: node.title, view: node.view });
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
        console.log(nodeId);
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
            (x) =>
              x.start === `${NODE_PREFIX}${nodeId}` ||
              x.end === `${NODE_PREFIX}${nodeId}`,
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

export const {
  appendNode,
  updateNode,
  editNode,
  addArrow,
  removeItem,
  setTempCard,
  initNodes,
} = makingNodeSlice.actions;
export default makingNodeSlice.reducer;
