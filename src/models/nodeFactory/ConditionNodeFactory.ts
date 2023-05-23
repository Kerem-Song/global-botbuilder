import { ConditionNodeEdit } from '@components/pages/scenario/edit/ConditionNodeEdit';
import { ConditionNode } from '@components/pages/scenario/nodes/ConditionNode';
import { INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IConditionView, IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class ConditionNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.CONDITION_NODE;
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
    return nodeDefaultHelper.createDefaultConditionView();
  }

  getEditElement() {
    return ConditionNodeEdit;
  }

  getNodeElement() {
    return ConditionNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createConditionNodeArrow(nodeId, view);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncTrueFalseNodeArrow(startId, endId, view);
  }

  getNodeImgIconUrl() {
    return '/src/assets/icons/ic_condition.svg';
  }

  getConnectId(node: INode) {
    const view = node.view as IConditionView;
    return [
      ...(view.trueThenNextNodeId ? [view.trueThenNextNodeId] : []),
      ...(view.falseThenNextNodeId ? [view.falseThenNextNodeId] : []),
    ];
  }
}
