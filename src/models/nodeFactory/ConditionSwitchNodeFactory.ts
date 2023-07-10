import { icCondition } from '@assets';
import { ConditionSwitchNodeEdit } from '@components/pages/scenario/edit/ConditionSwitchNodeEdit';
import { ConditionSwitchNode } from '@components/pages/scenario/nodes/ConditionSwitchNode';
import { INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IConditionView, IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class ConditionSwitchNodeFactory implements INodeFactory {
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
    return nodeDefaultHelper.createDefaultConditionSwitchView();
  }

  getEditElement() {
    return ConditionSwitchNodeEdit;
  }

  getNodeElement() {
    return ConditionSwitchNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createConditionNodeArrow(nodeId, view);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncConditionFalseNodeArrow(startId, endId, view);
  }

  getNodeImgIconUrl() {
    return icCondition;
  }

  getConnectId(node: INode) {
    const view = node.view as IConditionView;
    const item = view.items?.map((item) => item.nextNodeId);
    // console.log('@item', item);
    return [
      ...(node.nextNodeId ? [node.nextNodeId] : []),
      ...(view.falseThenNextNodeId ? [view.falseThenNextNodeId] : []),
    ];
  }
}
