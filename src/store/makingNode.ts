import { IArrow, INode, NODE_TYPES } from '@models';
import { INodeEditModel } from '@models/interfaces/INodeEditModel';
import {
  IAnswerView,
  IButtonCtrl,
  IHasButtonViewBase,
  IHasChildrenView,
  IListCardItem,
  INodeBase,
} from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { lunaToast } from '@modules/lunaToast';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NODE_PREFIX } from '../modules';
import { nodeHelper } from '../modules/nodeHelper';

export interface IBuilderInfo {
  nodes: INode[];
  arrows: IArrow[];
  selected?: INode | IArrow;
  changed: boolean;
}
const initialState: IBuilderInfo = {
  nodes: [],
  arrows: [],
  changed: false,
};

const convert = (node: INodeBase): { node: INode; arrows: IArrow[] } => {
  const result: INode = nodeHelper.convertToINode(node);
  const arrows = arrowHelper.initArrows(node);

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
      state.changed = false;
      converted.map((x) => (state.arrows = [...state.arrows, ...x.arrows]));
    },
    appendNode: (state, action: PayloadAction<INode>) => {
      const node = action.payload;
      console.log(node);
      state.nodes = [...state.nodes, node];
      state.changed = true;
    },
    updateNode: (state, action: PayloadAction<INode>) => {
      const node = action.payload;
      const matched = state.nodes.find((x) => x.id === node.id);
      if (matched) {
        const nodes = [...state.nodes];
        const index = nodes.indexOf(matched);
        nodes.splice(index, 1, node);
        state.nodes = nodes;
        state.changed = true;
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
        const updateArrows = arrowHelper.editArrows(node, arrows);

        if (updateArrows) {
          state.arrows = updateArrows;
        }

        nodes.splice(index, 1, {
          ...old,
          title: node.title,
          view: node.view,
          nextNodeId: node.nextNodeId,
        });
        state.nodes = nodes;
      }
      state.changed = true;
    },
    updateButtonOrder: (
      state,
      action: PayloadAction<{
        nodeId: string;
        carouselIndex?: number;
        buttons?: IButtonCtrl[];
        isQuicks?: boolean;
      }>,
    ) => {
      const { nodeId, carouselIndex, buttons, isQuicks } = action.payload;
      const node = state.nodes.find((x) => x.id === nodeId);

      if (node) {
        if (carouselIndex !== undefined) {
          const pView = node?.view as IHasChildrenView;
          const childrenViews = [...pView.childrenViews];
          const view = childrenViews[carouselIndex] as IHasButtonViewBase;
          childrenViews.splice(carouselIndex, 1, { ...view, buttons });
          const nodes = [...state.nodes];
          const index = nodes.indexOf(node);
          nodes.splice(index, 1, {
            ...node,
            view: { ...view, childrenViews } as IHasChildrenView,
          });
          state.nodes = nodes;
        } else {
          if (isQuicks) {
            const view = node?.view as IAnswerView;
            const nodes = [...state.nodes];
            const index = nodes.indexOf(node);
            nodes.splice(index, 1, {
              ...node,
              view: { ...view, quicks: buttons } as IAnswerView,
            });
            state.nodes = nodes;
          } else {
            const view = node?.view as IHasButtonViewBase;
            const nodes = [...state.nodes];
            const index = nodes.indexOf(node);
            nodes.splice(index, 1, {
              ...node,
              view: { ...view, buttons } as IHasButtonViewBase,
            });
            state.nodes = nodes;
          }
        }
      }
      state.changed = true;
    },
    addArrow: (state, action: PayloadAction<{ arrow: IArrow; errorMessage: string }>) => {
      const { arrow, errorMessage } = action.payload;

      const error = arrowHelper.validateArrows(
        arrow.updateKey || arrow.start,
        arrow.end,
        state.nodes,
        arrow.isNextNode,
      );
      if (error) {
        console.log(error);
        lunaToast.error(errorMessage);
        return;
      }

      const arrows = [...state.arrows];

      const found = arrows.find((x) => x.start === arrow.start);
      if (found) {
        const index = arrows.indexOf(found);
        arrows.splice(index, 1);
      }

      // arrow  와 action value 동기화
      const nodeId = arrow.updateKey || arrow.start;
      const node = state.nodes.find((x) => x.id === nodeId.substring(5));

      if (node) {
        arrowHelper.syncArrow(arrow.start, arrow.end, node);
      }

      state.arrows = [...arrows, arrow];
      state.changed = true;
    },
    removeItem: (state, action: PayloadAction<IArrow | string | undefined>) => {
      if (typeof action.payload === 'string') {
        const nodeId = action.payload as string;

        if (nodeId) {
          const found = state.nodes.find((x) => x.id === nodeId);

          if (!found) {
            return;
          }

          if (found.type === NODE_TYPES.INTENT_NODE) {
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

              const nodeId = arrow.updateKey || arrow.start;
              const node = state.nodes.find((x) => x.id === nodeId.substring(5));

              if (node) {
                arrowHelper.syncArrow(arrow.start, undefined, node);
              }
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

          const nodeId = arrow.updateKey || arrow.start;
          const node = state.nodes.find((x) => x.id === nodeId.substring(5));

          if (node) {
            arrowHelper.syncArrow(arrow.start, undefined, node);
          }

          state.arrows = arrows;
        }
      }
      state.changed = true;
    },
    updateListItemOrder: (
      state,
      action: PayloadAction<{
        nodeId: string;
        carouselIndex?: number;
        items?: IListCardItem[];
      }>,
    ) => {
      const { nodeId, carouselIndex, items } = action.payload;
      const node = state.nodes.find((x) => x.id === nodeId);

      if (node) {
        if (carouselIndex !== undefined) {
          const pView = node?.view as IHasChildrenView;
          const childrenViews = [...pView.childrenViews];
          const view = childrenViews[carouselIndex] as IHasButtonViewBase;
          childrenViews.splice(carouselIndex, 1, { ...view, items });
          const nodes = [...state.nodes];
          const index = nodes.indexOf(node);
          nodes.splice(index, 1, {
            ...node,
            view: { ...view, childrenViews } as IHasChildrenView,
          });
          state.nodes = nodes;
        } else {
          const view = node?.view as IHasButtonViewBase;
          const nodes = [...state.nodes];
          const index = nodes.indexOf(node);
          nodes.splice(index, 1, {
            ...node,
            view: { ...view, items } as IHasButtonViewBase,
          });
          state.nodes = nodes;
        }
      }
      state.changed = true;
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
  updateButtonOrder,
  updateListItemOrder,
} = makingNodeSlice.actions;
export default makingNodeSlice.reducer;
