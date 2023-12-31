import {
  ConditionJoin,
  ConditionOperator,
  TNodeTypes,
  TViewTypes,
  ValueOf,
} from '@models';
import { ImageAspectRatio, PriceDisplayType } from '@models/enum';
import { NodeKind } from '@models/enum/NodeKind';

export const ACTION_TYPES = {
  LUNA_NODE_REDIRECT: 'lunaNodeRedirect',
  ACT_VALUE_IS_UTTR: 'actValueIsUttr',
  LBL_IS_UTTR: 'lblIsUttr',
  URL: 'linkWebUrl',
};

export type ActionTypes = ValueOf<typeof ACTION_TYPES>;

export const CTRL_TYPES = {
  IMAGE_CTRL: 'ImageCtrl',
  BUTTON_CTRL: 'ButtonCtrl',
  QUICK_CTRL: 'QuickCtrl',
  LISTCARD_ITEM_CTRL: 'ListCardItemCtrl',
  LISTCARD_TEMPLATE_ITEM_CTRL: 'ListCardTemplateItemCtrl',
};

export type CtrlTypes = ValueOf<typeof CTRL_TYPES>;

export interface IViewItem {
  id: string;
  title: string;
  useImageCtrl: boolean;
  imageCtrl: {
    imageUrl: string;
  };
  buttons: {
    label: string;
    actionType: string;
    actionValue: string;
    id: string;
    typeName: string;
  }[];
}
export interface IQuickReplyRes {
  label: string;
  actionType: string;
  actionValue: string;
  id: string;
  typeName: string;
}

export interface IConditionItem {
  op1: string | null;
  op2: string | null;
  operator?: ConditionOperator;
}

export interface INodeView {
  typeName: string;
  title?: string;
  description?: string;
  useImageCtrl: boolean;
  imageCtrl: {
    imageUrl: string;
  };
  buttons: {
    label: string;
    actionType: string;
    actionValue: string;
    id: string;
    typeName: string;
  }[];
  text?: string;
  url?: string;
  childrenViews?: IViewItem[];
  quicks?: IQuickReplyRes[];

  /** condition node */
  falseThenNextNodeId?: string;
  trueThenNextNodeId?: string;
  join?: ConditionJoin;
  items?: IConditionItem[];
}

export interface INodeRes {
  alias: string;
  id: string;
  left: number;
  top: number;
  typeName: TNodeTypes;
  seq: number;
  nextNodeId: string;
  nodeKind: NodeKind;
  view?: INodeView;
  option: number;
}

export interface INodeBase {
  alias: string;
  id: string;
  left: number;
  nextNodeId?: string;
  nodeKind: NodeKind;
  option?: number;
  seq: number;
  top: number;
  typeName: TNodeTypes;
  view?: IViewBase;
}

export interface IViewBase {
  id: string;
  typeName: TViewTypes;
}

export interface IHasButtonViewBase extends IViewBase {
  buttons?: IButtonCtrl[];
  useImageCtrl?: boolean;
}

export interface IHasImageCtrlViewBase extends IViewBase {
  imageCtrl?: IImageCtrl;
  childrenViews?: IViewItem[];
  useImageCtrl?: boolean;
}

export interface IHasUtteranceViewBase extends IViewBase {
  utteranceParam?: string;
  useUtteranceParam?: boolean;
}

export interface IHasChildrenView extends IViewBase {
  childrenViews: IChildrenViewEnum;
  useImageCtrl?: boolean;
}

export interface IIntentNode extends INodeBase {
  view: IIntentView;
}

export interface IIntentView extends IViewBase {
  intents: IIntentItem[];
}

export interface IIntentItem {
  id: string;
  name: string;
}

export interface IAnswerNode extends INodeBase {
  view: IAnswerView;
}

export interface IAnswerView extends IHasUtteranceViewBase {
  quicks?: IButtonCtrl[];
}

export interface IConditionNode extends INodeBase {
  view: IConditionView;
}

export interface IConditionView extends ITrueFalseViewBase {
  join?: ConditionJoin;
  items?: IConditionItem[];
}

export interface ISwitchView extends IViewBase {
  childrenViews?: IConditionView[];
  defaultNextNodeId?: string;
}

export interface IRetryConditionNode extends INodeBase {
  view: IRetryConditionView;
}
export interface IRetryConditionView extends ITrueFalseViewBase {
  count: number;
}

export interface ITrueFalseViewBase extends IViewBase {
  falseThenNextNodeId?: string;
  trueThenNextNodeId?: string;
}

export interface ITextNode extends INodeBase {
  view: ITextView;
}
export interface ITextView extends IViewBase {
  text: string;
}

export interface IBasicCardCarouselNode extends INodeBase {
  view: IBasicCardCarouselView;
}

export interface IBasicCardCarouselView extends IHasButtonCarouselViewBase {
  isSuffle: boolean;
  count: number;
  childrenViews: IBasicCardView[];
}

export interface IBasicCardView extends IHasButtonViewBase {
  title?: string;
  description?: string;
  imageCtrl?: IImageCtrl;
}

export interface ICtrlBase {
  id: string;
  typeName: CtrlTypes;
}

export interface IImageCtrl extends ICtrlBase {
  actionType?: ActionTypes;
  actionValue?: string;
  altText: string;
  imageUrl: string;
  previewImageUrl?: string;
  aspectRatio?: ImageAspectRatio;
  imgPath: string;
}

export interface IButtonCtrl extends ICtrlBase {
  actionType?: ActionTypes;
  actionValue?: string;
  label: string;
  seq: number;
}

export type IChildrenViewEnum = (IBasicCardView | IListCardView | IProductCardView)[];
export interface ICarouselCtrl extends ICtrlBase {
  childrenViews: IChildrenViewEnum;
  typeName: TViewTypes;
}

export interface IBasicCardNode extends INodeBase {
  view: IBasicCardView;
}

export interface IParameterSetNode extends INodeBase {
  view: IParameterSetView;
}

export interface IParameterSetParams {
  name: string;
  value: string;
}
export interface IParameterSetView extends IViewBase {
  parameters?: IParameterSetParams[];
}

export interface IOtherFlowRedirectNode extends INodeBase {
  view: IOtherFlowRedirectView;
}

export interface IOtherFlowRedirectView extends IViewBase {
  otherFlowAlias?: string;
  otherFlowId?: string;
  otherNodeAlias?: string;
  otherNodeId?: string;
  otherNodeOption?: number;
}

export interface IListCardNode extends INodeBase {
  view: IListCardView;
}

export interface IListCardCarouselNode extends INodeBase {
  view: IListCardCarouselView;
}

export interface IListCardView extends IHasButtonViewBase {
  header: string;
  imageCtrl: IImageCtrl;
  seq: number;
  items: IListCardItem[];
}

export interface IListCardItem extends ICtrlBase {
  actionType: ActionTypes;
  actionValue?: string;
  description: string;
  imageUrl: string;
  seq: number;
  title: string;
  aspectRatio?: ImageAspectRatio;
  imgPath: string;
}

export interface IListCardCarouselView extends IHasButtonCarouselViewBase {
  isSuffle: boolean;
  count: number;
  childrenViews: IListCardView[];
}
export interface IProductCardView extends IHasButtonViewBase {
  currencyUnit: 'USD' | 'KRW' | 'JPY' | string;
  description: string;
  imageCtrl: IImageCtrl;
  priceDisplayType?: PriceDisplayType;
  retailPrice: number;
  discountAmount?: number;
  salePrice: number;
  profileIconUrl: string;
  profileName: string;
  seq: number;
  profileImgPath: string;
}

export interface IProductCardNode extends INodeBase {
  view: IProductCardCarouselView;
}

export interface IProductCardCarouselView extends IHasButtonCarouselViewBase {
  isSuffle: boolean;
  count: number;
  childrenViews: IProductCardView[];
}

export interface IHasButtonCarouselViewBase extends IViewBase {
  childrenViews: IHasButtonViewBase[];
  useImageCtrl?: boolean;
}
export interface IButtonEditViewBase extends IViewBase {
  childrenViews?: IHasButtonViewBase[];
  buttons?: IButtonCtrl[];
}
export interface IProductCardCarouselNode extends INodeBase {
  view: IProductCardCarouselView;
}

export interface IProductCardCarouselView extends IViewBase {
  isSuffle: boolean;
  count: number;
  childrenViews: IProductCardView[];
}

export interface IJson {
  key: string;
  value: string;
}
export interface IJsonRequestView extends IViewBase {
  method: 'POST' | 'GET';
  url: string;
  headers: IJson[];
  queryStrings?: IJson[];
  body?: string;
  responseMapping?: IJson[];
  apiRes?: string;
}

export interface IJsonCheckApiValidation {
  method: 'POST' | 'GET';
  url: string;
  headers: IJson[];
  queryStrings?: IJson[];
  body?: string;
  responseMapping?: IJson[];
}

export interface IDataApiTest {
  sessionToken: string;
  apiData: {
    method: string;
    url: string;
    body: string;
    headers: IJson[];
    queryStrings: IJson[];
    responseMapping: IJson[];
  };
}

export interface IDataCardView extends IViewBase {
  itemsRefName: string;
  count: number;
  isShuffle: boolean;
}

export interface IProductCardTemplateView extends IHasButtonViewBase {
  currencyUnit: 'USD' | 'KRW' | 'JPY' | string;
  description: string;
  imageCtrl: IImageCtrl;
  profileIconUrl: string;
  profileName: string;
  seq: number;
  profileImgPath: string;
  priceDisplayType: PriceDisplayType;
  retailPriceParam: string;
  discountAmountParam: string;
  salePriceParam: string;
}

export interface IDataBasicCardView extends IBasicCardView, IDataCardView {}

export interface IDataProductCardView extends IProductCardTemplateView, IDataCardView {}

export interface IDataListCardView extends IListCardView, IDataCardView {}

export interface ICSCenterSceneView extends IViewBase {
  sceneType: { SceneType: number };
}

export interface IParameterClearCardView extends IViewBase {
  isAll: boolean;
  parameters?: { name: '' }[];
}

export interface IGetFlowRes {
  alias: string;
  id: string;
  seq: number;
  nodes: INodeBase[];
}
