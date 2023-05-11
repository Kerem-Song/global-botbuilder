import { IntentNodeEdit } from '@components/pages/scenario/edit/IntentNodeEdit';
import { IntentNode } from '@components/pages/scenario/nodes/IntentNode';
import { NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';

import { INodeFactory } from './NodeFactory';

export class IntentNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.INTENT_NODE;
    this.nodeKind = NodeKind.CommandNode;
    this.NodeContextMenuKinds = NodeContextMenuKind.Utterance;
  }

  typeName: TNodeTypes;
  nodeKind: NodeKind;
  NodeContextMenuKinds: NodeContextMenuKind;

  getDefaultView() {
    return { id: '', typeName: this.typeName };
  }

  getEditElement() {
    return IntentNodeEdit;
  }

  getNodeElement() {
    return IntentNode;
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
}
