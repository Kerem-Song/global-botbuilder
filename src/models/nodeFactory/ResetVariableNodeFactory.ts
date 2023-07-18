import { icText } from '@assets';
import { CsNodeEdit } from '@components/pages/scenario/edit/CsNodeEdit';
import { ResetVariableNodeEdit } from '@components/pages/scenario/edit/ResetVariableNodeEdit';
import { ResetVariableNode } from '@components/pages/scenario/nodes';
import { NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class ResetVariableNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.RESET_VARIABLE_NODE;
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
    return nodeDefaultHelper.createDefaultResetVariableCardView();
  }

  getEditElement() {
    return ResetVariableNodeEdit;
  }

  getNodeElement() {
    return ResetVariableNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return [];
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    return;
  }

  getNodeImgIconUrl() {
    return icText;
  }

  getConnectId() {
    return [];
  }
}
