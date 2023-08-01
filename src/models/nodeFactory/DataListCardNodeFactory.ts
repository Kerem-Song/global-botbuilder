import { icDataList } from '@assets';
import { DataListCardNodeEdit } from '@components/pages/scenario/edit/DataListCardNodeEdit';
import { DataListCardNode } from '@components/pages/scenario/nodes/DataListCardNode';
import { NodeKind } from '@models/enum';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { INode, NODE_TYPES, TNodeTypes } from '@models/interfaces';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';
export class DataListCardNodeFactory implements INodeFactory {
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
    return nodeDefaultHelper.createDefaultDataListCardView();
  }

  getEditElement() {
    return DataListCardNodeEdit;
  }

  getNodeElement() {
    return DataListCardNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createHasButtonsArrow(nodeId, view, nextNodeId);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncHasButtonArrow(startId, endId, view);
  }

  getNodeImgIconUrl() {
    return 'icDataList';
  }

  getConnectId(node: INode) {
    return node.nextNodeId ? [node.nextNodeId] : [];
  }
}
