import { NodeKind } from '@models/enum/NodeKind';

import { TNodeTypes } from './ICard';
import { IViewBase } from './res/IGetFlowRes';

export interface INode {
  id: string;
  type: TNodeTypes;
  title?: string;
  description?: string;
  nodeKind: NodeKind;
  option: number;
  seq: number;
  x: number;
  y: number;
  view?: IViewBase;
  nextNodeId?: string;
}
