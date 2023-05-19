import { OtherFlowRedirectNodeEdit } from '@components/pages/scenario/edit/OtherFlowRedirectNodeEdit';
import { OtherFlowRedirectNode } from '@components/pages/scenario/nodes/OtherFlowRedirectNode';
import { NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class OtherFlowRedirectNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.OTHER_FLOW_REDIRECT_NODE;
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
    return nodeDefaultHelper.createDefaultOtherFlowRedirectView();
  }

  getEditElement() {
    return OtherFlowRedirectNodeEdit;
  }

  getNodeElement() {
    return OtherFlowRedirectNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return [];
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    return;
  }

  getNodeImgIconUrl() {
    return '';
  }
}
