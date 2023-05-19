import { AnswerNodeEdit } from '@components/pages/scenario/edit/AnswerNodeEdit';
import { AnswerNode } from '@components/pages/scenario/nodes/AnswerNode';
import { NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class AnswerNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.ANSWER_NODE;
    this.nodeKind = NodeKind.AnswerNode;
    this.NodeContextMenuKinds =
      NodeContextMenuKind.Duplication |
      NodeContextMenuKind.Cut |
      NodeContextMenuKind.Delete;
  }

  typeName: TNodeTypes;
  nodeKind: NodeKind;
  NodeContextMenuKinds: NodeContextMenuKind;

  getDefaultView() {
    return nodeDefaultHelper.createDefaultAnswerView();
  }

  getEditElement() {
    return AnswerNodeEdit;
  }

  getNodeElement() {
    return AnswerNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createAnswerNodeArrow(nodeId, view, nextNodeId);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncAnswerNodeArrow(startId, endId, view);
  }

  getNodeImgIconUrl() {
    return '';
  }
}
