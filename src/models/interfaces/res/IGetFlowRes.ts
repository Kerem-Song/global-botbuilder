import { ConditionJoin, ConditionOperator, TNodeTypes } from '@models';
import { NodeKind } from '@models/enum/NodeKind';

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
}

export interface IGetFlowRes {
  alias: string;
  id: string;
  nodes: INodeRes[];
}
