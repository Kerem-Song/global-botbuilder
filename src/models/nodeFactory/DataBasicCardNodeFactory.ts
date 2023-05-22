import { DataBasicCardNodeEdit } from '@components/pages/scenario/edit/DataBasicCardNodeEdit';
import { DataBasicCardNode } from '@components/pages/scenario/nodes/DataBasicCardNode';
import { NodeKind } from '@models/enum';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IArrow, INode, NODE_TYPES, TNodeTypes } from '@models/interfaces';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { FC } from 'react';

import { INodeFactory } from './NodeFactory';

export class DataBasicCardNodeFactory implements INodeFactory {
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
    return nodeDefaultHelper.createDefaultDataBasicCardView();
  }

  getEditElement() {
    return DataBasicCardNodeEdit;
  }

  getNodeElement() {
    return DataBasicCardNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createHasButtonsArrow(nodeId, view, nextNodeId);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncHasButtonArrow(startId, endId, view);
  }

  getNodeImgIconUrl() {
    return '';
  }

  getConnectId(node: INode) {
    return node.nextNodeId ? [node.nextNodeId] : [];
  }
}
