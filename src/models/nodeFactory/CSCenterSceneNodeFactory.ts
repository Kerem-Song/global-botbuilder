import { icText } from '@assets';
import { CSCenterSceneNodeEdit } from '@components/pages/scenario/edit/CSCenterSceneNodeEdit';
import { CSCenterSceneNode } from '@components/pages/scenario/nodes';
import { NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class CSCenterSceneNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.CS_CENTER_SCENE_NODE;
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
    return nodeDefaultHelper.createDefaultCSCenterSceneView();
  }

  getEditElement() {
    return CSCenterSceneNodeEdit;
  }

  getNodeElement() {
    return CSCenterSceneNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return [];
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    return;
  }

  getNodeImgIconUrl() {
    return 'icCS';
  }

  getConnectId() {
    return [];
  }
}
