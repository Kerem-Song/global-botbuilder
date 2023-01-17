import { UniqueIdentifier } from '@dnd-kit/core';
import { NodeKind } from '@models/enum/NodeKind';
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
  LIST: 'List',
  LIST_CAROUSEL: 'List Carousel',
  QUICK_REPLY: 'AnswerNode',
  CONDITION: 'Condition',
  COUNT: 'Count',
} as const;

export type ValueOf<T> = T[keyof T];

export type TCardsValues = ValueOf<typeof CARD_TYPES>;

export const VIEW_TYPES = {
  TEXT_VIEW: 'TextView',
  BASIC_CARD_CAROUSEL_VIEW: 'BasicCardCarouselView',
  ANSWER_VIEW: 'AnswerView',
  BASIC_CARD_VIEW: 'BasicCardView',
  JSON_REQUEST_VIEW: 'JsonRequestView',
  CONDITION_VIEW: 'ConditionView',
};

export const NODE_TYPES = {
  ANSWER_NODE: 'AnswerNode',
  BASIC_CARD_CAROUSEL_NODE: 'BasicCardCarouselNode',
  BASIC_CARD_CAROUSEL_TEMPLATE_NODE: 'BasicCardCarouselTemplateNode',
  BASIC_CARD_NODE: 'BasicCardNode',
  CONDITION_NODE: 'ConditionNode',
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
  LIST: 'ListNode',
  LIST_CAROUSEL: 'ListCarouselNode',
  COUNT: 'Count',
} as const;

export type TNodeTypes = ValueOf<typeof NODE_TYPES>;
export const getNodeKind = (nodeType: TNodeTypes) => {
  switch (nodeType) {
    case 'AnswerNode':
      return NodeKind.AnswerNode;
    case 'BasicCardCarouselNode':
    case 'BasicCardCarouselTemplateNode':
    case 'BasicCardNode':
    case 'ImageNode':
    case 'ListCarouselNode':
    case 'ListNode':
    case 'ProductCardCarouselNode':
    case 'ProductCardCarouselTemplateNode':
    case 'ProductCardNode':
    case 'ProductCardTemplateNode':
    case 'TextNode':
      return NodeKind.InputNode;
    default:
      return NodeKind.CommandNode;
  }
};
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
  brandName: string;
  imageUrl?: string;
}

export interface IBasicCard {
  type?:
    | typeof CARD_TYPES.TEXT
    | typeof CARD_TYPES.IMAGE
    | typeof CARD_TYPES.BUTTON_TEMPLATE
    | typeof CARD_TYPES.BUTTON_CAROUSEL;
  title?: string;
  description?: string;
  thumbnail?: IThumbnailType;
  buttons?: IButtonType[];
}

export interface ICommerceCard {
  type?: typeof CARD_TYPES.COMMERCE | typeof CARD_TYPES.COMMERCE_CAROUSEL;
  productName?: string;
  price?: number;
  currency?: string;
  discount?: number;
  discountRate?: number;
  discountPrice?: number;
  thumbnail?: IThumbnailType;
  profile?: Profile;
  buttons?: IButtonType[];
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
  type?: typeof CARD_TYPES.LIST | typeof CARD_TYPES.LIST_CAROUSEL;
  header?: {
    title?: string;
  };
  thumbnail?: IThumbnailType;
  items?: ISortableListItem[];
  buttons?: IButtonType[];
}

export interface IQuickReply {
  type?: typeof CARD_TYPES.QUICK_REPLY;
  label: string;
  action: 'message' | 'block';
  messageText?: string;
  blockId?: string;
  extra?: Record<string, any>;
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

export interface ICondition {
  type?: typeof CARD_TYPES.CONDITION;
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

export interface ICount {
  type?: typeof CARD_TYPES.COUNT;
  title: string;
  yellowNode: string; // 노란색 노드 : 응답할 말풍선 연결 - 말풍선 목록 타입으로 변경 요함
  redNode: string; //빨간색 노드 : 횟수 초과시 응답할 말풍선 연결 - 말풍선 목록 타입으로 변경 요함
  requestionNum?: number; // 재질문 횟수 설정
  requestionConnectedMessage: string; // 재질문할 메시지 연결 - 말풍선 목록 타입으로 변경 요함
  excessiveLimitedNumMessage: string; // 횟수 초과 메시지 연결 - 말풍선 목록 타입으로 변경 요함
}

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
  discountPrice?: number;
  thumbnail?: IThumbnailType;
  profile?: Profile;
  buttons?: IButtonType[];
}

export interface IListNode {
  type?: typeof NODE_TYPES.LIST | typeof NODE_TYPES.LIST_CAROUSEL;
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
  action: 'message' | 'block';
  messageText?: string;
  blockId?: string;
  extra?: Record<string, any>;
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

export interface ICountNode {
  type?: typeof NODE_TYPES.COUNT;
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
