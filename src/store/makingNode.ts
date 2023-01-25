import { IArrow, INode, NodeKind } from '@models';
import { IListCardNode, IProductCardNode, NODE_TYPES } from '@models/interfaces/ICard';
import {
  IAnswerViewModel,
  IBasicCardViewModel,
  IListCardViewModel,
  INodeEditModel,
  IProductCardViewModel,
  ITextViewModel,
} from '@models/interfaces/INodeEditModel';
import {
  ACTION_TYPES,
  IAnswerNode,
  IBasicCardCarouselNode,
  IBasicCardNode,
  IConditionNode,
  IIntentNode,
  INodeBase,
  ITextNode,
} from '@models/interfaces/res/IGetFlowRes';
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

const convert = (node: INodeBase): { node: INode; arrows: IArrow[] } => {
  const arrows: IArrow[] = [];
  const result: INode = {
    id: node.id,
    title: node.alias,
    x: node.left,
    y: node.top,
    type: node.typeName,
    nodeKind: node.nodeKind,
    option: node.option,
    seq: node.seq,
    nextNodeId: node.nextNodeId,
    view: node.view,
  };

  if (node.nextNodeId && node.nodeKind !== NodeKind.InputNode) {
    arrows.push({
      start: `next-${node.id}`,
      updateKey: `node-${node.id}`,
      end: `node-${node.nextNodeId}`,
      isNextNode: true,
      type: 'blue',
    });
  }

  // if (node.typeName === NODE_TYPES.INTENT_NODE) {
  //   if (node.nextNodeId) {
  //     arrows.push({
  //       start: `next-${node.id}`,
  //       updateKey: `node-${node.id}`,
  //       end: `node-${node.nextNodeId}`,
  //       isNextNode: true,
  //       type: 'blue',
  //     });
  //   }
  // }

  if (node.typeName === NODE_TYPES.ANSWER_NODE) {
    const answerNode: IAnswerNode = node as IAnswerNode;
    result.cards = answerNode.view.quicks?.map((x) => {
      if (x.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT) {
        arrows.push({
          start: `next-${x.id}`,
          updateKey: `node-${node.id}`,
          end: `node-${x.actionValue}`,
          isNextNode: true,
          type: 'blue',
        });
      }
      return {
        type: NODE_TYPES.ANSWER_NODE,
        id: x.id,
        label: x.label,
        action: x.actionType as 'message',
      };
    });
  }

  if (node.typeName === NODE_TYPES.CONDITION_NODE) {
    const conditionNode: IConditionNode = node as IConditionNode;

    if (conditionNode.view.falseThenNextNodeId) {
      arrows.push({
        start: `next-node-${node.id}-false`,
        updateKey: `node-${node.id}`,
        end: `node-${conditionNode.view.falseThenNextNodeId}`,
        isNextNode: true,
        type: 'red',
      });
    }

    if (conditionNode.view.trueThenNextNodeId) {
      arrows.push({
        start: `next-node-${node.id}-true`,
        updateKey: `node-${node.id}`,
        end: `node-${conditionNode.view.trueThenNextNodeId}`,
        isNextNode: true,
        type: 'green',
      });
    }
  }

  if (node.typeName === NODE_TYPES.BASIC_CARD_CAROUSEL_NODE) {
    const cardCarouselNode: IBasicCardCarouselNode = node as IBasicCardCarouselNode;
    cardCarouselNode.view.childrenViews.forEach((v) =>
      v.buttons?.forEach((b) => {
        if (b.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT && b.actionValue) {
          arrows.push({
            start: `next-${b.id}`,
            updateKey: `node-${node.id}`,
            end: `node-${b.actionValue}`,
            isNextNode: true,
            type: 'blue',
          });
        }
      }),
    );
  }

  if (node.typeName === NODE_TYPES.BASIC_CARD_NODE) {
    const cardNode: IBasicCardNode = node as IBasicCardNode;
    cardNode.view.buttons?.forEach((b) => {
      if (b.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT && b.actionValue) {
        arrows.push({
          start: `next-${b.id}`,
          updateKey: `node-${node.id}`,
          end: `node-${b.actionValue}`,
          isNextNode: true,
          type: 'blue',
        });
      }
    });
  }

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

      nodes
        .filter((x) => x.nodeKind === NodeKind.InputNode && x.nextNodeId)
        .map((n) => {
          const nextNode = nodes.find((x) => x.id === n.nextNodeId);
          if (nextNode) {
            state.arrows = [
              ...state.arrows,
              { start: `node-${n.id}`, end: `node-${n.nextNodeId}`, type: 'blue' },
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
    editNode: (state, action: PayloadAction<INodeEditModel>) => {
      const node = action.payload;
      const matched = state.nodes.find((x) => x.id === node.id);
      if (matched) {
        const nodes = [...state.nodes];
        const index = nodes.indexOf(matched);
        const old = nodes[index];
        old.view = node.view;
        // switch (old.type) {
        //   case NODE_TYPES.TEXT_NODE: {
        //     const card = old.cards?.[0] as IBasicCardNode;
        //     const view = node.view as ITextViewModel;
        //     card.view.description = view.text;
        //     break;
        //   }

        //   case NODE_TYPES.BASIC_CARD_NODE: {
        //     const card = old.cards?.[0] as IBasicCardNode;
        //     const view = node.view as IBasicCardViewModel;
        //     card.view.title = view.title;
        //     card.view.description = view.description;
        //     //card.view.buttons = [...(view.buttons || [])];
        //     break;
        //   }

        //   case NODE_TYPES.LIST_CARD_NODE: {
        //     const card = old.cards?.[0] as IListCardNode;
        //     const view = node.view as IListCardViewModel;
        //     card.header!.title = view.header?.title;
        //     card.items = [...(view.items || [])];
        //     card.buttons = [...(view.buttons || [])];
        //     break;
        //   }

        //   case NODE_TYPES.PRODUCT_CARD_NODE: {
        //     const card = old.cards?.[0] as IProductCardNode;
        //     const view = node.view as IProductCardViewModel;
        //     card.thumbnail = view.thumbnail;
        //     card.profile!.brandName = view.profile?.brandName;
        //     card.profile!.imageUrl = view.profile?.imageUrl;
        //     card.productName = view.productName;
        //     card.price = view.price;
        //     card.currency = view.currency;
        //     card.discount = view.discount;
        //     card.buttons = [...(view.buttons || [])];
        //     break;
        //   }

        //   case NODE_TYPES.ANSWER_NODE: {
        //     const card = old.cards?.[0] as IAnswerNode;
        //     const view = node.view as IAnswerViewModel;
        //     //card.allowRes = view.allowRes;
        //     //card.extra = view.extra;
        //     //card.label = view.label || '';
        //     //card.action = view.action || 'message';
        //   }
        // }
        nodes.splice(index, 1, { ...old, title: node.title });
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
