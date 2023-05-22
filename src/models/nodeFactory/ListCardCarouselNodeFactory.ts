import { ListCardCarouselNodeEdit } from '@components/pages/scenario/edit/ListCardCarouselNodeEdit';
import { ListCardCarouselNode } from '@components/pages/scenario/nodes/ListCardCarouselNode';
import { INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import {
  IHasButtonCarouselViewBase,
  IViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';

import { INodeFactory } from './NodeFactory';

export class ListCardCarouselNodeFactory implements INodeFactory {
  constructor() {
    this.typeName = NODE_TYPES.LIST_CARD_CAROUSEL_NODE;
    this.nodeKind = NodeKind.InputNode;
    this.NodeContextMenuKinds =
      NodeContextMenuKind.Duplication |
      NodeContextMenuKind.Cut |
      NodeContextMenuKind.Delete |
      NodeContextMenuKind.Carousel;
  }

  typeName: TNodeTypes;
  nodeKind: NodeKind;
  NodeContextMenuKinds: NodeContextMenuKind;

  getDefaultView() {
    return nodeDefaultHelper.createDefaultListCardCarouselView();
  }

  getEditElement() {
    return ListCardCarouselNodeEdit;
  }

  getNodeElement() {
    return ListCardCarouselNode;
  }

  createArrows(nodeId: string, nextNodeId?: string, view?: IViewBase) {
    return arrowHelper.createHasButtonsCarouselArrow(
      nodeId,
      view as IHasButtonCarouselViewBase,
      nextNodeId,
    );
  }

  syncArrow(startId: string, endId?: string, view?: IViewBase) {
    arrowHelper.syncHasButtonCarouselArrow(
      startId,
      endId,
      view as IHasButtonCarouselViewBase,
    );
  }

  getNodeImgIconUrl() {
    return '';
  }

  getConnectId(node: INode) {
    return node.nextNodeId ? [node.nextNodeId] : [];
  }
}
