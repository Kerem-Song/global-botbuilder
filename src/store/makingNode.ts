import { IArrow, INode } from '@models';
import { NODE_TYPES, TNodeTypes } from '@models/interfaces/ICard';
import { INodeRes } from '@models/interfaces/res/IGetFlowRes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IBuilderInfo {
  nodes: INode[];
  arrows: IArrow[];
  selected?: INode | IArrow;
}
const initialState: IBuilderInfo = {
  nodes: [],
  arrows: [],
};

const convert = (node: INodeRes): INode => {
  const result: INode = {
    id: node.id,
    title: node.alias,
    x: node.left,
    y: node.top,
    type: node.typeName as TNodeTypes,
  };

  if (node.view) {
    if (node.view.typeName === 'TextView') {
      result.cards = [{ type: NODE_TYPES.TEXT_NODE, title: node.view.text || '' }];
    }

    if (
      node.view.typeName === 'BasicCardCarouselView' &&
      node.view.childrenViews &&
      node.view.childrenViews.length > 0
    ) {
      result.cards = node.view.childrenViews.map((x) => {
        return {
          type: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
          title: x.title || '',
          // description?: string;
          thumbnail: {
            imageUrl: x.imageCtrl?.imageUrl,
          },
          buttons: x.buttons.map((b) => {
            return {
              id: b.id,
              label: b.label,
              action: b.actionType as 'linkWebUrl',
            };
          }),
        };
      });
    }

    if (node.view.typeName === 'AnswerView' && node.view.quicks?.length) {
      result.cards = node.view.quicks.map((x) => {
        return {
          type: NODE_TYPES.ANSWER_NODE,
          label: x.label,
          action: x.actionType as 'message',
        };
      });
    }
  }

  return result;
};

export const makingNodeSlice = createSlice({
  name: 'makingNode',
  initialState,
  reducers: {
    initNodes: (state, action: PayloadAction<INodeRes[] | undefined>) => {
      const nodes = action.payload || [];
      state.nodes = nodes.map((x) => convert(x));
      state.arrows = [];
      nodes
        .filter((x) => x.nodeKind === 2 && x.nextNodeId)
        .map((n) => {
          const nextNode = nodes.find((x) => x.id === n.nextNodeId);
          if (nextNode) {
            state.arrows = [
              ...state.arrows,
              { start: `node-${n.id}`, end: `node-${n.nextNodeId}` },
            ];
          }
        });
    },
    appendNode: (state, action: PayloadAction<INode>) => {
      const node = action.payload;
      state.nodes = [...state.nodes, node];
    },
    updateNode: (state, action: PayloadAction<INode>) => {
      const node = action.payload;
      // console.log(node);
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

export const { appendNode, updateNode, addArrow, removeItem, setTempCard, initNodes } =
  makingNodeSlice.actions;
export default makingNodeSlice.reducer;