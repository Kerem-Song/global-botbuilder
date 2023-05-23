import { BasicCardNodeEdit } from '@components/pages/scenario/edit/BasicCardNodeEdit';
import { BasicCardNode } from '@components/pages/scenario/nodes/BasicCardNode';
import { INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class BasicCardNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.BASIC_CARD_NODE;
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
    return nodeDefaultHelper.createDefaultBasicCardView();
  }

  getEditElement() {
    return BasicCardNodeEdit;
  }

  getNodeElement() {
    return BasicCardNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createHasButtonsArrow(nodeId, view, nextNodeId);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncHasButtonArrow(startId, endId, view);
  }

  getNodeImgIconUrl() {
    return '/src/assets/icons/ic_btn_temple.svg';
  }

  getConnectId(node: INode) {
    return node.nextNodeId ? [node.nextNodeId] : [];
  }
}
