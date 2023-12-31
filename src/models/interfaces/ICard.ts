import { UniqueIdentifier } from '@dnd-kit/core';
import { NodeKind } from '@models/enum/NodeKind';
import { ValueOf } from '@models/types/ValueOf';

import { IScenarioModel } from './IScenarioModel';
export interface IThumbnailType {
  imageUrl: string;
  link?: OsLinkType;
  fixedRatio?: boolean;
  width?: number;
  height?: number;
}

export type OsLinkType = {
  mobile?: string;
  ios?: string;
  android?: string;
  pc?: string;
  mac?: string;
  win?: string;
  web?: string;
};

export const CARD_TYPES = {
  INTENT: 'IntentNode',
  OTHER_FLOW: 'OtherFlowRedirectNode',
  TEXT: 'Text',
  IMAGE: 'Image',
  BUTTON_TEMPLATE: 'Button Template',
  BUTTON_CAROUSEL: 'Button Carousel',
  COMMERCE: 'Commerce',
  COMMERCE_CAROUSEL: 'Commerce Carousel',
  LIST_CARD_NODE: 'List',
  LIST_CARD_CAROUSEL_NODE: 'List Carousel',
  QUICK_REPLY: 'AnswerNode',
  CONDITION: 'Condition',
  RETRY_CONDITION: 'RetryCondition',
} as const;

export type TCardsValues = ValueOf<typeof CARD_TYPES>;

export const VIEW_TYPES = {
  TEXT_VIEW: 'TextView',
  BASIC_CARD_CAROUSEL_VIEW: 'BasicCardCarouselView',
  ANSWER_VIEW: 'AnswerView',
  BASIC_CARD_VIEW: 'BasicCardView',
  JSON_REQUEST_VIEW: 'JsonRequestView',
  CONDITION_VIEW: 'ConditionView',
  SWITCH_VIEW: 'SwitchView',
  OTHER_FLOW_REDIRECT_VIEW: 'OtherFlowRedirectView',
  LIST_CARD_VIEW: 'ListCardView',
  LIST_CARD_CAROUSEL_VIEW: 'ListCardCarouselView',
  PRODUCT_CARD_VIEW: 'ProductCardView',
  PRODUCT_CARD_CAROUSEL_VIEW: 'ProductCardCarouselView',
  RETRY_CONDITION_VIEW: 'RetryConditionView',
  PARAMETER_SET_NODE_VIEW: 'ParameterSetView',
  DATA_BASIC_CARD_VIEW: 'BasicCardCarouselTemplateView',
  DATA_PRODUCT_CARD_VIEW: 'ProductCardCarouselTemplateView',
  DATA_LIST_CARD_VIEW: 'ListCardCarouselTemplateView',
  CS_CENTER_SCENE_VIEW: 'CSCenterSceneView',
  RESET_VARIABLE_CARD_VIEW: 'ParameterClearCardView',
};

export const NODE_TYPES = {
  ANSWER_NODE: 'AnswerNode',
  BASIC_CARD_CAROUSEL_NODE: 'BasicCardCarouselNode',
  BASIC_CARD_CAROUSEL_TEMPLATE_NODE: 'BasicCardCarouselTemplateNode',
  BASIC_CARD_NODE: 'BasicCardNode',
  CONDITION_NODE: 'ConditionNode',
  SWITCH_NODE: 'SwitchNode',
  IMAGE_NODE: 'ImageNode',
  INTENT_NODE: 'IntentNode',
  JSON_REQUEST_NODE: 'JsonRequestNode',
  OTHER_FLOW_REDIRECT_NODE: 'OtherFlowRedirectNode',
  PARAMETER_SET_NODE: 'ParameterSetNode',
  PRODUCT_CARD_CAROUSEL_NODE: 'ProductCardCarouselNode',
  PRODUCT_CARD_CAROUSEL_TEMPLATE_NODE: 'ProductCardCarouselTemplateNode',
  PRODUCT_CARD_NODE: 'ProductCardNode',
  PRODUCT_CARD_TEMPLATE_NODE: 'ProductCardTemplateNode',
  TEXT_NODE: 'TextNode',
  LIST_CARD_NODE: 'ListCardNode',
  LIST_CARD_CAROUSEL_NODE: 'ListCardCarouselNode',
  RETRY_CONDITION_NODE: 'RetryConditionNode',
  DATA_BASIC_CARD_NODE: 'BasicCardCarouselTemplateNode',
  DATA_PRODUCT_CARD_NODE: 'ProductCardCarouselTemplateNode',
  DATA_LIST_CARD_NODE: 'ListCardCarouselTemplateNode',
  CS_CENTER_SCENE_NODE: 'CSCenterSceneNode',
  PARAMETER_CLEAR_NODE: 'ParameterClearNode',
} as const;

export type TViewTypes = ValueOf<typeof VIEW_TYPES>;
export type TNodeTypes = ValueOf<typeof NODE_TYPES>;

export interface IButtonType {
  id: UniqueIdentifier;
  label: string;
  action:
    | 'linkWebUrl'
    | 'message'
    | 'block'
    | 'phone'
    | 'operator'
    | 'osLink'
    | 'addChannel';
  actionValue?: string;
  webLinkUrl?: string;
  messageText?: string;
  blockId?: string;
  osLink?: OsLinkType;
  phoneNumber?: string;
  extra?: Record<string, any>;
  type?: typeof NODE_TYPES.ANSWER_NODE;
}

export interface Profile {
  brandName?: string;
  imageUrl?: string;
}
export interface ISortableListItem {
  id: UniqueIdentifier;
  thumbnail?: IThumbnailType;
  title?: string;
  description?: string;
  action?: 'block' | 'message';
  blockId?: string;
  messageText?: string;
  extra?: Map<string, any>;
  link?: 'pc' | 'mobile' | 'web';
}

export interface IListCard {
  type?: typeof CARD_TYPES.LIST_CARD_NODE | typeof CARD_TYPES.LIST_CARD_CAROUSEL_NODE;
  header?: {
    title?: string;
  };
  thumbnail?: IThumbnailType;
  items?: ISortableListItem[];
  buttons?: IButtonType[];
}

export type TConditionSelect =
  | null
  | 'equal'
  | 'notEqual'
  | 'contain'
  | 'greaterThan'
  | 'lesserThan'
  | 'notEmpty'
  | 'regex'; //RegExp 타입 호환 검토 필요

export interface IBasicCardNode {
  type?:
    | typeof NODE_TYPES.TEXT_NODE
    | typeof NODE_TYPES.IMAGE_NODE
    | typeof NODE_TYPES.BASIC_CARD_NODE
    | typeof NODE_TYPES.BASIC_CARD_CAROUSEL_NODE
    | typeof NODE_TYPES.BASIC_CARD_CAROUSEL_TEMPLATE_NODE;
  title?: string;
  description?: string;
  thumbnail?: IThumbnailType;
  buttons?: IButtonType[];
}

export interface IProductCardNode {
  type?:
    | typeof NODE_TYPES.PRODUCT_CARD_NODE
    | typeof NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE
    | typeof NODE_TYPES.PRODUCT_CARD_TEMPLATE_NODE
    | typeof NODE_TYPES.PRODUCT_CARD_CAROUSEL_TEMPLATE_NODE;
  productName?: string;
  price?: number;
  currency?: string;
  discount?: number;
  discountRate?: number;
  discountAmount?: number;
  thumbnail?: IThumbnailType;
  profile?: Profile;
  buttons?: IButtonType[];
}

export interface IListCardNode {
  type?: typeof NODE_TYPES.LIST_CARD_NODE | typeof NODE_TYPES.LIST_CARD_CAROUSEL_NODE;
  allowHeadImgField?: boolean;
  header?: {
    title?: string;
  };
  thumbnail?: IThumbnailType;
  items?: ISortableListItem[];
  buttons?: IButtonType[];
}

export interface IAnswerNode {
  type?: typeof NODE_TYPES.ANSWER_NODE;
  id: string;
  label: string;
  action:
    | 'linkWebUrl'
    | 'message'
    | 'block'
    | 'phone'
    | 'operator'
    | 'osLink'
    | 'addChannel';
  messageText?: string;
  blockId?: string;
  allowRes?: boolean;
  extra?: Record<string, any>;
  connectedScenario?: IScenarioModel;
  url?: string;
}

export interface IConditionNode {
  type?: typeof NODE_TYPES.CONDITION_NODE;
  title: string;
  greenNode: string; // 초록색 노드 : 사용자가 입력한 값이 조건에 부합하는 경우 응답할 말풍선 연결 - 말풍선 목록 타입으로 변경 요함
  redNode: string; //빨간색 노드 : 사용자가 입력한 값이 조건에 부합하지 않는 경우 응답할 말풍선 연결 - 말풍선 목록 타입으로 변경 요함
  userInput?: string | number; // 사용자 입력 값
  condition?: TConditionSelect; // 조건 선택
  comparativeValue?: string; // 비교할 값
  variableChoice?: string | number; // 변수 선택
  logicalOperator?: 'and' | 'or' | null; // AND/OR 조건 설정
  connectedMessage?: string; // 메시지 연결 - 말풍선 목록 타입으로 변경 요함
  elseMessage?: string; // else 다음 메시지말풍선 목록 타입으로 변경 요함
}

export interface IRetryConditionNode {
  type?: typeof NODE_TYPES.RETRY_CONDITION_NODE;
  title: string;
  yellowNode: string; // 노란색 노드 : 응답할 말풍선 연결 - 말풍선 목록 타입으로 변경 요함
  redNode: string; //빨간색 노드 : 횟수 초과시 응답할 말풍선 연결 - 말풍선 목록 타입으로 변경 요함
  requestionNum?: number; // 재질문 횟수 설정
  requestionConnectedMessage: string; // 재질문할 메시지 연결 - 말풍선 목록 타입으로 변경 요함
  excessiveLimitedNumMessage: string; // 횟수 초과 메시지 연결 - 말풍선 목록 타입으로 변경 요함
}

export interface IOtherFlowRedirectNode {
  id: string;
  type: typeof NODE_TYPES.OTHER_FLOW_REDIRECT_NODE;
}
