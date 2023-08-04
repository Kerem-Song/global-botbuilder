import { ParameterClearNodeEdit } from '@components/pages/scenario/edit/ParameterClearNodeEdit';
import { ParameterClearNode } from '@components/pages/scenario/nodes';
import { INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class ParameterClearNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.PARAMETER_CLEAR_NODE;
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
    return nodeDefaultHelper.createDefaultParameterClearCardView();
  }

  getEditElement() {
    return ParameterClearNodeEdit;
  }

  getNodeElement() {
    return ParameterClearNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    if (!nextNodeId) {
      return [];
    }

    return [arrowHelper.createNextArrow(nodeId, nextNodeId)];
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    return;
  }

  getNodeImgIconUrl() {
    return 'icParameterClear';
  }

  getConnectId(node: INode) {
    return node.nextNodeId ? [node.nextNodeId] : [];
  }
}
