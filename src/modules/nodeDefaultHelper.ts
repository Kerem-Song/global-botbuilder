import {
  ConditionJoin,
  ConditionOperator,
  ImageAspectRatio,
  NODE_TYPES,
  TNodeTypes,
  VIEW_TYPES,
} from '@models';
import {
  ACTION_TYPES,
  CTRL_TYPES,
  IAnswerView,
  IBasicCardCarouselView,
  IBasicCardView,
  IConditionView,
  IListCardCarouselView,
  IListCardItem,
  IListCardView,
  IOtherFlowRedirectView,
  IParameterSetParams,
  IProductCardCarouselView,
  IProductCardView,
  IRetryConditionView,
  ITextView,
} from '@models/interfaces/res/IGetFlowRes';

import { ID_GEN, ID_TYPES } from './idGen';

export const nodeDefaultHelper = {
  createDefaultView: (nodeType: TNodeTypes) => {
    switch (nodeType) {
      case NODE_TYPES.TEXT_NODE:
        return nodeDefaultHelper.createDefaultTextView();
      case NODE_TYPES.BASIC_CARD_NODE:
        return nodeDefaultHelper.createDefaultBasicCardView();
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        return nodeDefaultHelper.createDefaultBasicCardCarouselView();
      case NODE_TYPES.LIST_CARD_NODE:
        return nodeDefaultHelper.createDefaultListCardView();
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
        return nodeDefaultHelper.createDefaultListCardCarouselView();
      case NODE_TYPES.CONDITION_NODE:
        return nodeDefaultHelper.createDefaultConditionView();
      case NODE_TYPES.ANSWER_NODE:
        return nodeDefaultHelper.createDefaultAnswerView();
      case NODE_TYPES.PARAMETER_SET_NODE:
        return nodeDefaultHelper.createDefaultParameterSetView();
      case NODE_TYPES.OTHER_FLOW_REDIRECT_NODE:
        return nodeDefaultHelper.createDefaultOtherFlowRedirectView();
      case NODE_TYPES.PRODUCT_CARD_NODE:
        return nodeDefaultHelper.createCommerceView();
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        return nodeDefaultHelper.createCommerceCarouselView();
      case NODE_TYPES.RETRY_CONDITION_NODE:
        return nodeDefaultHelper.createDefaultRetryConditionView();
      default:
        return undefined;
    }
  },
  createDefaultRetryConditionView: () => {
    const result: IRetryConditionView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.RETRY_CONDITION_VIEW,
      count: 1,
    };

    return result;
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
      useImageCtrl: true,
      imageCtrl: {
        imageUrl: '',
        altText: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
        aspectRatio: ImageAspectRatio.Rectangle,
      },
      buttons: [nodeDefaultHelper.createDefaultButtonCtrl()],
    };

    return result;
  },
  createDefaultButtonCtrl: (index = 0) => {
    return {
      id: ID_GEN.generate(ID_TYPES.CTRL),
      label: `버튼 ${index + 1}`,
      seq: index,
      typeName: CTRL_TYPES.BUTTON_CTRL,
      actionType: ACTION_TYPES.LUNA_NODE_REDIRECT,
    };
  },
  createDefaultBasicCardCarouselView: () => {
    const result: IBasicCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.BASIC_CARD_VIEW,
      childrenViews: [nodeDefaultHelper.createDefaultBasicCardView()],
      useImageCtrl: true,
      isSuffle: false,
      count: 10,
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
      quicks: [nodeDefaultHelper.createDefaultAnswerQickItem(0)],
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
    const result = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.PARAMETER_SET_NODE_VIEW,
      parameters: [{ name: '', value: '' }],
    };

    return result;
  },
  createDefaultParameterSetParams: () => {
    const result: IParameterSetParams = {
      name: '',
      value: '',
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
  createDefaultListCardItem: (seq?: number) => {
    const result: IListCardItem = {
      id: ID_GEN.generate(ID_TYPES.CTRL),
      typeName: CTRL_TYPES.LISTCARD_ITEM_CTRL,
      description: '',
      imageUrl: '',
      title: '',
      seq: seq || 0,
      actionType: '',
      actionValue: '',
    };

    return result;
  },
  createDefaultListCardView: () => {
    const result: IListCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.LIST_CARD_VIEW,
      header: '',
      seq: 0,
      items: [nodeDefaultHelper.createDefaultListCardItem()],
      useImageCtrl: true,
      imageCtrl: {
        imageUrl: '',
        altText: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
        aspectRatio: ImageAspectRatio.Rectangle,
      },
      buttons: [nodeDefaultHelper.createDefaultButtonCtrl()],
    };

    return result;
  },
  createDefaultListCardCarouselView: () => {
    const result: IListCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.LIST_CARD_CAROUSEL_VIEW,
      childrenViews: [nodeDefaultHelper.createDefaultListCardView()],
      useImageCtrl: true,
      isSuffle: false,
      count: 10,
    };

    return result;
  },
  createCommerceView: () => {
    const result: IProductCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.PRODUCT_CARD_VIEW,
      retailPrice: 0,
      salePrice: 0,
      discountPrice: 0,
      profileIconUrl: '',
      profileName: '',
      description: '',
      seq: 0,
      currencyUnit: 'KRW',
      useImageCtrl: true,
      imageCtrl: {
        imageUrl: '',
        altText: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
        aspectRatio: ImageAspectRatio.Rectangle,
      },
      buttons: [nodeDefaultHelper.createDefaultButtonCtrl()],
    };

    return result;
  },
  createCommerceCarouselView: () => {
    const result: IProductCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.PRODUCT_CARD_CAROUSEL_VIEW,
      childrenViews: [nodeDefaultHelper.createCommerceView()],
      isSuffle: false,
      count: 10,
    };
    return result;
  },
};
