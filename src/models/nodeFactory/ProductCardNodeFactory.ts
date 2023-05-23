import { ProductCardNodeEdit } from '@components/pages/scenario/edit/ProductCardNodeEdit';
import { CommerceCardNode } from '@components/pages/scenario/nodes/CommerceCardNode';
import { INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class ProductCardNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.PRODUCT_CARD_NODE;
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
    return nodeDefaultHelper.createDefaultCommerceView();
  }

  getEditElement() {
    return ProductCardNodeEdit;
  }

  getNodeElement() {
    return CommerceCardNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createHasButtonsArrow(nodeId, view, nextNodeId);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncHasButtonArrow(startId, endId, view);
  }

  getNodeImgIconUrl() {
    return '/src/assets/icons/ic_commerce.svg';
  }

  getConnectId(node: INode) {
    return node.nextNodeId ? [node.nextNodeId] : [];
  }
}
