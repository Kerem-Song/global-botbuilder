import TextNodeEdit from '@components/pages/scenario/edit/TextNodeEdit';
import { TextNode } from '@components/pages/scenario/nodes/TextNode';
import { INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class TextNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.TEXT_NODE;
    this.nodeKind = NodeKind.InputNode;
    this.NodeContextMenuKinds =
      NodeContextMenuKind.Duplication |
      NodeContextMenuKind.Cut |
      NodeContextMenuKind.Delete;
  }

  typeName: TNodeTypes;
  nodeKind: NodeKind;
  NodeContextMenuKinds: NodeContextMenuKind;

  getDefaultView() {
    return nodeDefaultHelper.createDefaultTextView();
  }

  getEditElement() {
    return TextNodeEdit;
  }

  getNodeElement() {
    return TextNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    if (!nextNodeId) {
      return [];
    }

    return [arrowHelper.createConnectArrow(nodeId, nextNodeId)];
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    return;
  }

  getNodeImgIconUrl() {
    return '';
  }

  getConnectId(node: INode) {
    return node.nextNodeId ? [node.nextNodeId] : [];
  }
}
