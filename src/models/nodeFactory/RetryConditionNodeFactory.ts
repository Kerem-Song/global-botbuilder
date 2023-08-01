import { icCount } from '@assets';
import { RetryConditionNodeEdit } from '@components/pages/scenario/edit/RetryConditionNodeEdit';
import { RetryConditionNode } from '@components/pages/scenario/nodes/RetryConditionNode';
import { INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IRetryConditionView, IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class RetryConditionNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.RETRY_CONDITION_NODE;
    this.nodeKind = NodeKind.CommandNode;
    this.NodeContextMenuKinds =
      NodeContextMenuKind.Duplication |
      NodeContextMenuKind.Cut |
      NodeContextMenuKind.Delete;
  }

  typeName: TNodeTypes;
  nodeKind: NodeKind;
  NodeContextMenuKinds: NodeContextMenuKind;

  getDefaultView() {
    return nodeDefaultHelper.createDefaultRetryConditionView();
  }

  getEditElement() {
    return RetryConditionNodeEdit;
  }

  getNodeElement() {
    return RetryConditionNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createRetryConditionNodeArrow(nodeId, view as IRetryConditionView);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncTrueFalseNodeArrow(startId, endId, view);
  }

  getNodeImgIconUrl() {
    return 'icCount';
  }

  getConnectId(node: INode) {
    const view = node.view as IRetryConditionView;
    return [
      ...(view.trueThenNextNodeId ? [view.trueThenNextNodeId] : []),
      ...(view.falseThenNextNodeId ? [view.falseThenNextNodeId] : []),
    ];
  }
}
