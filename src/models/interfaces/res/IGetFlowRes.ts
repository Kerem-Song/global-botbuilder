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
export interface INodeView {
  typeName: string;
  childrenViews?: IViewItem[];
  quicks?: IQuickReplyRes[];
}
export interface INodeRes {
  alias: string;
  id: string;
  left: number;
  top: number;
  typeName: string;
  seq: number;
  nextNodeId: string;
  view?: INodeView;
}

export interface IGetFlowRes {
  alias: string;
  id: string;
  nodes: INodeRes[];
}
