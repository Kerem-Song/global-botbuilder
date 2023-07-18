import { useRootState } from '@hooks';
import { ConditionJoin, ImageAspectRatio, TNodeTypes, VIEW_TYPES } from '@models';
import { PriceDisplayType } from '@models/enum';
import {
  ACTION_TYPES,
  CTRL_TYPES,
  IAnswerView,
  IBasicCardCarouselView,
  IBasicCardView,
  IConditionView,
  ICsCardView,
  IDataBasicCardView,
  IDataListCardView,
  IDataProductCardView,
  IJsonRequestView,
  IListCardCarouselView,
  IListCardItem,
  IListCardView,
  IOtherFlowRedirectView,
  IParameterSetParams,
  IProductCardCarouselView,
  IProductCardView,
  IResetVariableCardView,
  IRetryConditionView,
  ISwitchView,
  ITextView,
} from '@models/interfaces/res/IGetFlowRes';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';

import { SYS_BOT_ICON, SYS_BRAND_CURRENCY } from './constants';
import { ID_GEN, ID_TYPES } from './idGen';

export const nodeDefaultHelper = {
  tc: (key: string) => {
    console.log(`tc is not set(key:${key})`);
  },
  createDefaultView: (nodeType: TNodeTypes) => {
    return nodeFactory.getFactory(nodeType)?.getDefaultView();
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
  createDefaultBasicCardView: (
    useImageCtrl = true,
    aspectRatio = ImageAspectRatio.Rectangle,
  ) => {
    const result: IBasicCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.BASIC_CARD_VIEW,
      title: '',
      description: '',
      useImageCtrl: useImageCtrl,
      imageCtrl: {
        imageUrl: '',
        altText: '',
        imgPath: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
        aspectRatio: aspectRatio,
      },
      buttons: [nodeDefaultHelper.createDefaultButtonCtrl()],
    };

    return result;
  },
  createDefaultButtonCtrl: (index = 0) => {
    return {
      id: ID_GEN.generate(ID_TYPES.CTRL),
      label: `${nodeDefaultHelper.tc('DEFAULT_LBL_BUTTON')} ${index + 1}`,
      seq: index,
      typeName: CTRL_TYPES.BUTTON_CTRL,
      actionType: ACTION_TYPES.LUNA_NODE_REDIRECT,
    };
  },
  createDefaultBasicCardCarouselView: (
    useImageCtrl = true,
    aspectRatio = ImageAspectRatio.Rectangle,
  ) => {
    const result: IBasicCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.BASIC_CARD_VIEW,
      childrenViews: [
        nodeDefaultHelper.createDefaultBasicCardView(useImageCtrl, aspectRatio),
      ],
      useImageCtrl: useImageCtrl,
      isSuffle: false,
      count: 10,
    };

    return result;
  },
  createDefaultConditionView: () => {
    const result: IConditionView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.CONDITION_VIEW,
      items: [{ op1: '', operator: undefined, op2: '' }],
      join: ConditionJoin.And,
    };

    return result;
  },
  createDefaultConditions: (
    join: ConditionJoin | undefined = undefined,
    seq?: number,
  ) => {
    const result: IConditionView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.CONDITION_VIEW,
      items: [
        {
          op1: '',
          operator: undefined,
          op2: '',
        },
      ],
      join: join,
      trueThenNextNodeId: '',
    };

    return result;
  },
  createDefaultSwitchView: (join = undefined) => {
    const result: ISwitchView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.SWITCH_VIEW,
      conditions: [nodeDefaultHelper.createDefaultConditions(join)],
      defaultNextNodeId: '',
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
      label: `${nodeDefaultHelper.tc('DEFAULT_LBL_QUICKREPLY')} ${index + 1}`,
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
      imgPath: '',
      title: '',
      seq: seq || 0,
      actionType: '',
      actionValue: '',
    };

    return result;
  },
  createDefaultListCardView: (
    useImageCtrl = true,
    aspectRatio = ImageAspectRatio.Rectangle,
  ) => {
    const result: IListCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.LIST_CARD_VIEW,
      header: '',
      seq: 0,
      items: [
        nodeDefaultHelper.createDefaultListCardItem(),
        nodeDefaultHelper.createDefaultListCardItem(1),
      ],
      useImageCtrl: useImageCtrl,
      imageCtrl: {
        imageUrl: '',
        altText: '',
        imgPath: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
        aspectRatio: aspectRatio,
      },
      buttons: [],
    };

    return result;
  },
  createDefaultListCardCarouselView: (
    useImageCtrl = true,
    aspectRatio = ImageAspectRatio.Rectangle,
  ) => {
    const result: IListCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.LIST_CARD_CAROUSEL_VIEW,
      childrenViews: [
        nodeDefaultHelper.createDefaultListCardView(useImageCtrl, aspectRatio),
      ],
      useImageCtrl: useImageCtrl,
      isSuffle: false,
      count: 10,
    };

    return result;
  },
  createDefaultCommerceView: (
    useImageCtrl = true,
    aspectRatio = ImageAspectRatio.Rectangle,
  ) => {
    const result: IProductCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.PRODUCT_CARD_VIEW,
      retailPrice: 0,
      salePrice: 0,
      discountAmount: 0,

      currencyUnit: SYS_BRAND_CURRENCY,
      profileIconUrl: SYS_BOT_ICON,
      profileImgPath: '',
      profileName: '',
      description: '',
      seq: 0,
      useImageCtrl: useImageCtrl,
      imageCtrl: {
        imageUrl: '',
        altText: '',
        imgPath: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
        aspectRatio: aspectRatio,
      },
      buttons: [nodeDefaultHelper.createDefaultButtonCtrl()],
    };

    return result;
  },
  createDefaultCommerceCarouselView: (
    useImageCtrl = true,
    aspectRatio = ImageAspectRatio.Rectangle,
  ) => {
    const result: IProductCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.PRODUCT_CARD_CAROUSEL_VIEW,
      childrenViews: [
        nodeDefaultHelper.createDefaultCommerceView(useImageCtrl, aspectRatio),
      ],
      isSuffle: false,
      useImageCtrl: useImageCtrl,
      count: 10,
    };
    return result;
  },
  createDefaultJsonRequestView: () => {
    const result: IJsonRequestView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.JSON_REQUEST_VIEW,
      body: '',
      headers: [{ key: '', value: '' }],
      method: 'POST',
      queryStrings: [{ key: '', value: '' }],
      responseMapping: [{ key: '', value: '' }],
      url: '',
    };
    return result;
  },
  createDefaultDataBasicCardView: (
    useImageCtrl = true,
    aspectRatio = ImageAspectRatio.Rectangle,
  ) => {
    const result: IDataBasicCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.DATA_BASIC_CARD_VIEW,
      itemsRefName: '',
      count: 1,
      isShuffle: false,
      useImageCtrl: useImageCtrl,
      title: '',
      description: '',
      imageCtrl: {
        imageUrl: '',
        altText: '',
        imgPath: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
        aspectRatio: aspectRatio,
      },
      buttons: [nodeDefaultHelper.createDefaultButtonCtrl()],
    };
    return result;
  },
  createDefaultDataProductCardView: (
    useImageCtrl = true,
    aspectRatio = ImageAspectRatio.Rectangle,
  ) => {
    const result: IDataProductCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.DATA_PRODUCT_CARD_VIEW,
      itemsRefName: '',
      count: 1,
      isShuffle: false,
      useImageCtrl: useImageCtrl,
      priceDisplayType: PriceDisplayType.All,
      retailPriceParam: '',
      discountAmountParam: '',
      salePriceParam: '',
      profileIconUrl: SYS_BOT_ICON,
      profileImgPath: '',
      profileName: '',
      description: '',
      seq: 0,
      currencyUnit: SYS_BRAND_CURRENCY,
      imageCtrl: {
        imageUrl: '',
        altText: '',
        imgPath: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
        aspectRatio: aspectRatio,
      },
      buttons: [nodeDefaultHelper.createDefaultButtonCtrl()],
    };
    return result;
  },
  createDefaultDataListCardView: (
    useImageCtrl = true,
    aspectRatio = ImageAspectRatio.Rectangle,
  ) => {
    const result: IDataListCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.DATA_LIST_CARD_VIEW,
      itemsRefName: '',
      count: 1,
      isShuffle: false,
      useImageCtrl: useImageCtrl,
      header: '',
      seq: 0,
      items: [
        nodeDefaultHelper.createDefaultListCardItem(),
        nodeDefaultHelper.createDefaultListCardItem(1),
      ],
      imageCtrl: {
        imageUrl: '',
        altText: '',
        imgPath: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
        aspectRatio: aspectRatio,
      },
      buttons: [],
    };
    return result;
  },
  createDefaultCsCardView: () => {
    const result: ICsCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.CS_CARD_VIEW,
      isConsult: true,
      isLive: true,
      inquiryType: '',
    };
    return result;
  },
  createDefaultResetVariableCardView: () => {
    const result: IResetVariableCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.RESET_VARIABLE_CARD_VIEW,
      variables: [{ key: '', value: '' }],
    };
    return result;
  },
};
