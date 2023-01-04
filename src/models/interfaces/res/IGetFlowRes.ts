export type NodeType = 'IntentNode' | 'BasicCardCarouselNode';
export interface INodeRes {
  alias: string;
  id: string;
  left: number;
  top: number;
  typeName: NodeType;
  seq: number;
  nextNodeId: string;
}

export interface IGetFlowRes {
  alias: string;
  id: string;
  nodes: INodeRes[];
}
