import { JsonRequestNodeEdit } from '@components/pages/scenario/edit/JsonRequestNodeEdit';
import { JsonRequestNode } from '@components/pages/scenario/nodes/JsonRequestNode';
import { NodeKind } from '@models/enum';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { NODE_TYPES, TNodeTypes } from '@models/interfaces';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class JsonRequestNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.JSON_REQUEST_NODE;
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
    return nodeDefaultHelper.createDefaultJsonRequestView();
  }

  getEditElement() {
    return JsonRequestNodeEdit;
  }

  getNodeElement() {
    return JsonRequestNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createHasButtonsArrow(nodeId, view, nextNodeId);
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncHasButtonArrow(startId, endId, view);
  }
}
