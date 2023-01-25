import { ConditionJoin, INode, NODE_TYPES, TNodeTypes, VIEW_TYPES } from '@models';
import {
  ACTION_TYPES,
  CTRL_TYPES,
  IAnswerView,
  IBasicCardCarouselView,
  IBasicCardView,
  IConditionView,
  IIntentNode,
  IIntentView,
  INodeBase,
  IOtherFlowRedirectView,
  IParameterSetView,
  ITextView,
} from '@models/interfaces/res/IGetFlowRes';

import { ID_GEN, ID_TYPES } from './idGen';

export const nodeHelper = {
  createDefaultView: (nodeType: TNodeTypes) => {
    switch (nodeType) {
      case NODE_TYPES.TEXT_NODE:
        return nodeHelper.createDefaultTextView();
      case NODE_TYPES.BASIC_CARD_NODE:
        return nodeHelper.createDefaultBasicCardView();
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        return nodeHelper.createDefaultBasicCardCarouselView();
      case NODE_TYPES.CONDITION_NODE:
        return nodeHelper.createDefaultConditionView();
      case NODE_TYPES.ANSWER_NODE:
        return nodeHelper.createDefaultAnswerView();
      case NODE_TYPES.PARAMETER_SET_NODE:
        return nodeHelper.createDefaultParameterSetView();
      case NODE_TYPES.OTHER_FLOW_REDIRECT_NODE:
        return nodeHelper.createDefaultOtherFlowRedirectView();
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
      items: [],
      join: ConditionJoin.And,
    };

    return result;
  },
  createDefaultAnswerView: () => {
    const result: IAnswerView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.ANSWER_VIEW,
      quicks: [
        {
          id: ID_GEN.generate(ID_TYPES.CTRL),
          label: '퀵 리플라이 1',
          seq: 0,
          typeName: CTRL_TYPES.QUICK_CTRL,
          actionType: ACTION_TYPES.LUNA_NODE_REDIRECT,
        },
      ],
    };

    return result;
  },
  createDefaultParameterSetView: () => {
    const result: IParameterSetView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.ANSWER_VIEW,
      parameters: {},
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
  ConvertToNode: (node: INode) => {
    const converted: INodeBase = {
      id: node.id,
      alias: node.title || '',
      left: node.x,
      top: node.y,
      typeName: node.type,
      nodeKind: node.nodeKind,
      option: node.option,
      seq: node.seq,
      view: node.view ? { ...node.view } : undefined,
    };

    return converted;
  },
};
