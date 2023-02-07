import {
  ConditionJoin,
  ConditionOperator,
  IArrow,
  INode,
  INodeEditModel,
  NODE_TYPES,
  NodeKind,
  TNodeTypes,
  VIEW_TYPES,
} from '@models';
import {
  ACTION_TYPES,
  CTRL_TYPES,
  IAnswerNode,
  IAnswerView,
  IBasicCardCarouselNode,
  IBasicCardCarouselView,
  IBasicCardNode,
  IBasicCardView,
  IConditionNode,
  IConditionView,
  IListCardCarouselView,
  IListCardView,
  INodeBase,
  IOtherFlowRedirectView,
  IParameterSetView,
  IProductCardView,
  ITextView,
} from '@models/interfaces/res/IGetFlowRes';

import { NEXT_BUTTON_PREFIX, NODE_PREFIX } from './constants';
import { ID_GEN, ID_TYPES } from './idGen';

const editableArrowNodeTypes: string[] = [
  NODE_TYPES.ANSWER_NODE,
  NODE_TYPES.BASIC_CARD_NODE,
  NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
  NODE_TYPES.CONDITION_NODE,
];

export const nodeHelper = {
  createDefaultView: (nodeType: TNodeTypes) => {
    switch (nodeType) {
      case NODE_TYPES.TEXT_NODE:
        return nodeHelper.createDefaultTextView();
      case NODE_TYPES.BASIC_CARD_NODE:
        return nodeHelper.createDefaultBasicCardView();
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        return nodeHelper.createDefaultBasicCardCarouselView();
      case NODE_TYPES.LIST_CARD_NODE:
        return nodeHelper.createDefaultListCardView();
      case NODE_TYPES.LIST_CAROUSEL:
        return nodeHelper.createDefaultListCardCarouselView();
      case NODE_TYPES.CONDITION_NODE:
        return nodeHelper.createDefaultConditionView();
      case NODE_TYPES.ANSWER_NODE:
        return nodeHelper.createDefaultAnswerView();
      case NODE_TYPES.PARAMETER_SET_NODE:
        return nodeHelper.createDefaultParameterSetView();
      case NODE_TYPES.OTHER_FLOW_REDIRECT_NODE:
        return nodeHelper.createDefaultOtherFlowRedirectView();
      case NODE_TYPES.PRODUCT_CARD_NODE:
        return nodeHelper.createCommerceView();
      default:
        return undefined;
    }
  },
  createDefaultTextView: () => {
    const result: ITextView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      text: '',
      typeName: VIEW_TYPES.TEXT_VIEW,
    };

    return result;
  },
  createDefaultBasicCardView: () => {
    const result: IBasicCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.BASIC_CARD_VIEW,
      title: '',
      description: '',
      imageCtrl: {
        imageUrl: '',
        altText: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
      },
      buttons: [
        {
          id: ID_GEN.generate(ID_TYPES.CTRL),
          label: '버튼 1',
          seq: 0,
          typeName: CTRL_TYPES.BUTTON_CTRL,
          actionType: ACTION_TYPES.LUNA_NODE_REDIRECT,
        },
      ],
    };

    return result;
  },
  createDefaultBasicCardCarouselView: () => {
    const result: IBasicCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.BASIC_CARD_VIEW,
      childrenViews: [nodeHelper.createDefaultBasicCardView()],
      isSuffle: false,
      count: 0,
    };

    return result;
  },
  createDefaultConditionView: () => {
    const result: IConditionView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.CONDITION_VIEW,
      items: [{ op1: '', operator: ConditionOperator.Is, op2: '' }],
      join: ConditionJoin.And,
    };

    return result;
  },
  createDefaultAnswerView: () => {
    const result: IAnswerView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.ANSWER_VIEW,
      quicks: [nodeHelper.createDefaultAnswerQickItem(0)],
    };

    return result;
  },
  createDefaultAnswerQickItem: (index: number) => {
    const result = {
      id: ID_GEN.generate(ID_TYPES.CTRL),
      label: `퀵 리플라이 ${index + 1}`,
      seq: index,
      typeName: CTRL_TYPES.QUICK_CTRL,
      actionType: ACTION_TYPES.LUNA_NODE_REDIRECT,
    };
    return result;
  },
  createDefaultParameterSetView: () => {
    const result: IParameterSetView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.ANSWER_VIEW,
      parameters: [{ name: '', value: '' }],
    };

    return result;
  },
  createDefaultOtherFlowRedirectView: () => {
    const result: IOtherFlowRedirectView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.OTHER_FLOW_REDIRECT_VIEW,
    };
    return result;
  },
  createDefaultListCardView: () => {
    const result: IListCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.LIST_CARD_VIEW,
      header: '',
      seq: 0,
      items: [],
      imageCtrl: {
        imageUrl: '',
        altText: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
      },
      buttons: [
        {
          id: ID_GEN.generate(ID_TYPES.CTRL),
          label: '버튼 1',
          seq: 0,
          typeName: CTRL_TYPES.BUTTON_CTRL,
          actionType: ACTION_TYPES.LUNA_NODE_REDIRECT,
        },
      ],
    };

    return result;
  },
  createDefaultListCardCarouselView: () => {
    const result: IListCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.LIST_CARD_CAROUSEL_VIEW,
      childrenViews: [nodeHelper.createDefaultListCardView()],
      isSuffle: false,
      count: 0,
    };

    return result;
  },
  createCommerceView: () => {
    const result: IProductCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.PRODUCT_CARD_VIEW,
      retailPrice: 0,
      salePrice: 0,
      profileIconUrl: '',
      profileName: '',
      description: '',
      seq: 0,
      currencyUnit: 'KRW',
      imageCtrl: {
        imageUrl: '',
        altText: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
      },
      buttons: [
        {
          id: ID_GEN.generate(ID_TYPES.CTRL),
          label: '버튼 1',
          seq: 0,
          typeName: CTRL_TYPES.BUTTON_CTRL,
          actionType: ACTION_TYPES.LUNA_NODE_REDIRECT,
        },
      ],
    };

    return result;
  },
  convertToINodeBase: (node: INode): INodeBase => {
    const converted: INodeBase = {
      id: node.id,
      alias: node.title || '',
      left: node.x,
      top: node.y,
      typeName: node.type,
      nodeKind: node.nodeKind,
      option: node.option,
      seq: node.seq,
      nextNodeId: node.nextNodeId,
      view: node.view ? { ...node.view } : undefined,
    };

    return converted;
  },
  convertToINode: (node: INodeBase): INode => {
    return {
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
  },
  createNextArrow: (nodeId: string, nextNodeId: string): IArrow => {
    return {
      start: `next-${nodeId}`,
      updateKey: `${NODE_PREFIX}${nodeId}`,
      end: `${NODE_PREFIX}${nextNodeId}`,
      isNextNode: true,
      type: 'blue',
    };
  },
  createConnectArrow: (nodeId: string, connectNodeId: string): IArrow => {
    return {
      start: `${NODE_PREFIX}${nodeId}`,
      end: `${NODE_PREFIX}${connectNodeId}`,
      type: 'blue',
    };
  },
  createAnswerNodeArrow: (nodeId: string, view: IAnswerView): IArrow[] => {
    const result: IArrow[] = [];
    view.quicks?.map((x) => {
      if (x.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT && x.actionValue) {
        result.push({
          start: `${NEXT_BUTTON_PREFIX}${x.id}`,
          updateKey: `${NODE_PREFIX}${nodeId}`,
          end: `${NODE_PREFIX}${x.actionValue}`,
          isNextNode: true,
          type: 'blue',
        });
      }
    });

    return result;
  },
  createConditionNodeArrow: (nodeId: string, view: IConditionView): IArrow[] => {
    const result: IArrow[] = [];
    if (view.falseThenNextNodeId) {
      result.push({
        start: `next-node-${nodeId}-false`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.falseThenNextNodeId}`,
        isNextNode: true,
        type: 'red',
      });
    }

    if (view.trueThenNextNodeId) {
      result.push({
        start: `next-node-${nodeId}-true`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.trueThenNextNodeId}`,
        isNextNode: true,
        type: 'green',
      });
    }

    return result;
  },
  createBasicCardArrow: (nodeId: string, view: IBasicCardView): IArrow[] => {
    const result: IArrow[] = [];
    view.buttons?.forEach((b) => {
      if (b.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT && b.actionValue) {
        result.push({
          start: `next-${b.id}`,
          updateKey: `${NODE_PREFIX}${nodeId}`,
          end: `${NODE_PREFIX}${b.actionValue}`,
          isNextNode: true,
          type: 'blue',
        });
      }
    });
    return result;
  },
  createBasicCardCarouselArrow: (
    nodeId: string,
    view: IBasicCardCarouselView,
  ): IArrow[] => {
    const result: IArrow[] = [];
    result.push(
      ...view.childrenViews
        .map((view) => nodeHelper.createBasicCardArrow(nodeId, view))
        .flat(1),
    );
    return result;
  },
  editArrows: (node: INodeEditModel, arrows: IArrow[]): IArrow[] | undefined => {
    if (!editableArrowNodeTypes.includes(node.nodeType)) {
      return undefined;
    }

    const removeArrows = arrows.filter(
      (x) => x.updateKey === `${NODE_PREFIX}${node.id}` && x.isNextNode,
    );

    if (removeArrows.length) {
      removeArrows.forEach((arrow) => {
        const index = arrows.indexOf(arrow);
        arrows.splice(index, 1);
      });
    }

    switch (node.nodeType) {
      case NODE_TYPES.ANSWER_NODE:
        arrows.push(
          ...nodeHelper.createAnswerNodeArrow(node.id, node.view as IAnswerView),
        );
        break;
      case NODE_TYPES.BASIC_CARD_NODE:
        arrows.push(
          ...nodeHelper.createBasicCardArrow(node.id, node.view as IBasicCardView),
        );
        break;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        arrows.push(
          ...nodeHelper.createBasicCardCarouselArrow(
            node.id,
            node.view as IBasicCardCarouselView,
          ),
        );
        break;
      case NODE_TYPES.CONDITION_NODE:
        arrows.push(
          ...nodeHelper.createConditionNodeArrow(
            node.id,
            node.view as IBasicCardCarouselView,
          ),
        );
        break;
    }

    return arrows;
  },

  initArrows: (node: INodeBase): IArrow[] => {
    const arrows: IArrow[] = [];
    if (node.nextNodeId) {
      if (node.nodeKind === NodeKind.InputNode) {
        arrows.push(nodeHelper.createConnectArrow(node.id, node.nextNodeId));
      } else {
        arrows.push(nodeHelper.createNextArrow(node.id, node.nextNodeId));
      }
    }

    if (node.typeName === NODE_TYPES.ANSWER_NODE) {
      const answerNode: IAnswerNode = node as IAnswerNode;
      arrows.push(...nodeHelper.createAnswerNodeArrow(answerNode.id, answerNode.view));
    }

    if (node.typeName === NODE_TYPES.CONDITION_NODE) {
      const conditionNode: IConditionNode = node as IConditionNode;
      arrows.push(
        ...nodeHelper.createConditionNodeArrow(conditionNode.id, conditionNode.view),
      );
    }

    if (node.typeName === NODE_TYPES.BASIC_CARD_CAROUSEL_NODE) {
      const cardCarouselNode: IBasicCardCarouselNode = node as IBasicCardCarouselNode;
      arrows.push(
        ...nodeHelper.createBasicCardCarouselArrow(
          cardCarouselNode.id,
          cardCarouselNode.view,
        ),
      );
    }

    if (node.typeName === NODE_TYPES.BASIC_CARD_NODE) {
      const cardNode: IBasicCardNode = node as IBasicCardNode;
      arrows.push(...nodeHelper.createBasicCardArrow(cardNode.id, cardNode.view));
    }

    return arrows;
  },
};
