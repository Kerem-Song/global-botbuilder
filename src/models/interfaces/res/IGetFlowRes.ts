import {
  ConditionJoin,
  ConditionOperator,
  TNodeTypes,
  TViewTypes,
  ValueOf,
} from '@models';
import { NodeKind } from '@models/enum/NodeKind';

export const ACTION_TYPES = {
  LUNA_NODE_REDIRECT: 'lunaNodeRedirect',
};

export type ActionTypes = ValueOf<typeof ACTION_TYPES>;

export const CTRL_TYPES = {
  IMAGE_CTRL: 'ImageCtrl',
  BUTTON_CTRL: 'ButtonCtrl',
  QUICK_CTRL: 'QuickCtrl',
};

export type CtrlTypes = ValueOf<typeof CTRL_TYPES>;

export interface IViewItem {
  id: string;
  title: string;
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
  op1: string;
  op2: string;
  operator: ConditionOperator;
}

export interface INodeView {
  typeName: string;
  title?: string;
  description?: string;
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
  option: number;
  seq: number;
  top: number;
  typeName: TNodeTypes;
  view?: IViewBase;
}

export interface IViewBase {
  id: string;
  typeName: TViewTypes;
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

export interface IAnswerView extends IViewBase {
  quicks?: IQuickItem[];
  utteranceParam?: string;
}

export interface IQuickItem {
  id: string;
  actionType: ActionTypes;
  actionValue?: string;
  label: string;
  seq: number;
  typeName: CtrlTypes;
}

export interface IConditionNode extends INodeBase {
  view: IConditionView;
}

export interface IConditionView extends IViewBase {
  falseThenNextNodeId?: string;
  trueThenNextNodeId?: string;
  join?: ConditionJoin;
  items?: IConditionItem[];
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

export interface IBasicCardCarouselView extends IViewBase {
  isSuffle: boolean;
  count: number;
  childrenViews: IBasicCardView[];
}

export interface IBasicCardView extends IViewBase {
  title?: string;
  description?: string;
  imageCtrl?: IImageCtrl;
  buttons?: IButtonCtrl[];
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
}

export interface IButtonCtrl extends ICtrlBase {
  actionType?: ActionTypes;
  actionValue?: string;
  label: string;
  seq: number;
}

export interface IBasicCardNode extends INodeBase {
  view: IBasicCardView;
}

export interface IGetFlowRes {
  alias: string;
  id: string;
  seq: number;
  nodes: INodeBase[];
}
