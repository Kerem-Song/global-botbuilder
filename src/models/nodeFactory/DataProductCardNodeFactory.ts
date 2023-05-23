import { DataProductCardNodeEdit } from '@components/pages/scenario/edit/DataProductCardNodeEdit';
import { DataProductCardNode } from '@components/pages/scenario/nodes/DataProductCardNode';
import { NodeKind } from '@models/enum';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { INode, NODE_TYPES, TNodeTypes } from '@models/interfaces';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class DataProductCardNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.DATA_BASIC_CARD_NODE;
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
    return nodeDefaultHelper.createDefaultDataProductCardView();
  }

  getEditElement() {
    return DataProductCardNodeEdit;
  }

  getNodeElement() {
    return DataProductCardNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createHasButtonsArrow(nodeId, view, nextNodeId);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncHasButtonArrow(startId, endId, view);
  }

  getNodeImgIconUrl() {
    return '/src/assets/icons/ic_data_commerce_card.svg';
  }

  getConnectId(node: INode) {
    return node.nextNodeId ? [node.nextNodeId] : [];
  }
}
