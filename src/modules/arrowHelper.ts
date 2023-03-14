import { IArrow, INode, INodeEditModel, NODE_TYPES, NodeKind } from '@models';
import {
  ACTION_TYPES,
  IAnswerView,
  IConditionView,
  IHasButtonCarouselViewBase,
  IHasButtonViewBase,
  INodeBase,
  IRetryConditionView,
  ITrueFalseViewBase,
} from '@models/interfaces/res/IGetFlowRes';

import { FALSE_SUFFIX, NEXT_BUTTON_PREFIX, NODE_PREFIX, TRUE_SUFFIX } from './constants';

const editableArrowNodeTypes: string[] = [
  NODE_TYPES.INTENT_NODE,
  NODE_TYPES.ANSWER_NODE,
  NODE_TYPES.BASIC_CARD_NODE,
  NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
  NODE_TYPES.PRODUCT_CARD_NODE,
  NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE,
  NODE_TYPES.LIST_CARD_NODE,
  NODE_TYPES.LIST_CARD_CAROUSEL_NODE,
  NODE_TYPES.CONDITION_NODE,
  NODE_TYPES.RETRY_CONDITION_NODE,
  NODE_TYPES.PARAMETER_SET_NODE,
];

export const arrowHelper = {
  createNextArrow: (nodeId: string, nextNodeId: string): IArrow => {
    return {
      start: `${NEXT_BUTTON_PREFIX}${nodeId}`,
      updateKey: `${NODE_PREFIX}${nodeId}`,
      end: `${NODE_PREFIX}${nextNodeId}`,
      isNextNode: true,
      type: 'blue',
    };
  },
  createConnectArrow: (nodeId: string, connectNodeId: string): IArrow => {
    return {
      start: `${NODE_PREFIX}${nodeId}`,
      end: `${NODE_PREFIX}${connectNodeId}`,
      type: 'blue',
    };
  },
  createAnswerNodeArrow: (nodeId: string, view: IAnswerView): IArrow[] => {
    const result: IArrow[] = [];
    view.quicks?.map((x) => {
      if (x.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT && x.actionValue) {
        result.push({
          start: `${NEXT_BUTTON_PREFIX}${x.id}`,
          updateKey: `${NODE_PREFIX}${nodeId}`,
          end: `${NODE_PREFIX}${x.actionValue}`,
          isNextNode: true,
          type: 'blue',
        });
      }
    });

    return result;
  },
  createConditionNodeArrow: (nodeId: string, view: IConditionView): IArrow[] => {
    const result: IArrow[] = [];
    if (view.falseThenNextNodeId) {
      result.push({
        start: `${NEXT_BUTTON_PREFIX}${nodeId}${FALSE_SUFFIX}`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.falseThenNextNodeId}`,
        isNextNode: true,
        type: 'red',
      });
    }

    if (view.trueThenNextNodeId) {
      result.push({
        start: `${NEXT_BUTTON_PREFIX}${nodeId}${TRUE_SUFFIX}`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.trueThenNextNodeId}`,
        isNextNode: true,
        type: 'green',
      });
    }

    return result;
  },
  createRetryConditionNodeArrow: (
    nodeId: string,
    view: IRetryConditionView,
  ): IArrow[] => {
    const result: IArrow[] = [];

    if (view.falseThenNextNodeId) {
      result.push({
        start: `${NEXT_BUTTON_PREFIX}${nodeId}${FALSE_SUFFIX}`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.falseThenNextNodeId}`,
        isNextNode: true,
        type: 'yellow',
      });
    }

    if (view.trueThenNextNodeId) {
      result.push({
        start: `${NEXT_BUTTON_PREFIX}${nodeId}${TRUE_SUFFIX}`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.trueThenNextNodeId}`,
        isNextNode: true,
        type: 'green',
      });
    }

    return result;
  },
  createHasButtonsArrow: (nodeId: string, view: IHasButtonViewBase): IArrow[] => {
    const result: IArrow[] = [];
    view.buttons?.forEach((b) => {
      if (b.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT && b.actionValue) {
        result.push({
          start: `${NEXT_BUTTON_PREFIX}${b.id}`,
          updateKey: `${NODE_PREFIX}${nodeId}`,
          end: `${NODE_PREFIX}${b.actionValue}`,
          isNextNode: true,
          type: 'blue',
        });
      }
    });
    console.log('createbuttonsArrow', result);
    return result;
  },
  createHasButtonsCarouselArrow: (
    nodeId: string,
    view: IHasButtonCarouselViewBase,
  ): IArrow[] => {
    const result: IArrow[] = [];
    result.push(
      ...view.childrenViews
        .map((view) => arrowHelper.createHasButtonsArrow(nodeId, view))
        .flat(1),
    );
    return result;
  },
  // createBasicCardArrow: (nodeId: string, view: IBasicCardView): IArrow[] => {
  //   const result: IArrow[] = [];
  //   view.buttons?.forEach((b) => {
  //     if (b.actionType === ACTION_TYPES.LUNA_NODE_REDIRECT && b.actionValue) {
  //       result.push({
  //         start: `${NEXT_BUTTON_PREFIX}${b.id}`,
  //         updateKey: `${NODE_PREFIX}${nodeId}`,
  //         end: `${NODE_PREFIX}${b.actionValue}`,
  //         isNextNode: true,
  //         type: 'blue',
  //       });
  //     }
  //   });
  //   return result;
  // },
  // createBasicCardCarouselArrow: (
  //   nodeId: string,
  //   view: IBasicCardCarouselView,
  // ): IArrow[] => {
  //   const result: IArrow[] = [];
  //   result.push(
  //     ...view.childrenViews
  //       .map((view) => arrowHelper.createHasButtonsArrow(nodeId, view))
  //       .flat(1),
  //   );
  //   return result;
  // },
  editArrows: (node: INodeEditModel, arrows: IArrow[]): IArrow[] | undefined => {
    if (!editableArrowNodeTypes.includes(node.type)) {
      return undefined;
    }

    const removeArrows = arrows.filter(
      (x) => x.updateKey === `${NODE_PREFIX}${node.id}` && x.isNextNode,
    );

    if (removeArrows.length) {
      removeArrows.forEach((arrow) => {
        const index = arrows.indexOf(arrow);
        arrows.splice(index, 1);
      });
    }

    if (node.nextNodeId) {
      if (node.type !== NODE_TYPES.OTHER_FLOW_REDIRECT_NODE) {
        arrows.push(arrowHelper.createNextArrow(node.id, node.nextNodeId));
      }
    }

    console.log('node.type', node.type);
    switch (node.type) {
      case NODE_TYPES.ANSWER_NODE:
        arrows.push(
          ...arrowHelper.createAnswerNodeArrow(node.id, node.view as IAnswerView),
        );
        break;
      case NODE_TYPES.BASIC_CARD_NODE:
      case NODE_TYPES.LIST_CARD_NODE:
      case NODE_TYPES.PRODUCT_CARD_NODE:
        arrows.push(
          ...arrowHelper.createHasButtonsArrow(node.id, node.view as IHasButtonViewBase),
        );
        break;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        arrows.push(
          ...arrowHelper.createHasButtonsCarouselArrow(
            node.id,
            node.view as IHasButtonCarouselViewBase,
          ),
        );
        break;
      case NODE_TYPES.CONDITION_NODE:
        arrows.push(
          ...arrowHelper.createConditionNodeArrow(node.id, node.view as IConditionView),
        );
        break;
      case NODE_TYPES.RETRY_CONDITION_NODE:
        arrows.push(
          ...arrowHelper.createRetryConditionNodeArrow(
            node.id,
            node.view as IRetryConditionView,
          ),
        );
        break;
    }

    return arrows;
  },

  initArrows: (node: INodeBase): IArrow[] => {
    const arrows: IArrow[] = [];
    if (node.nextNodeId) {
      if (node.nodeKind === NodeKind.InputNode) {
        arrows.push(arrowHelper.createConnectArrow(node.id, node.nextNodeId));
      } else if (node.typeName !== NODE_TYPES.OTHER_FLOW_REDIRECT_NODE) {
        arrows.push(arrowHelper.createNextArrow(node.id, node.nextNodeId));
      }
    }

    switch (node.typeName) {
      case NODE_TYPES.ANSWER_NODE:
        arrows.push(
          ...arrowHelper.createAnswerNodeArrow(node.id, node.view as IAnswerView),
        );
        break;
      case NODE_TYPES.CONDITION_NODE:
        arrows.push(
          ...arrowHelper.createConditionNodeArrow(node.id, node.view as IConditionView),
        );
        break;

      case NODE_TYPES.RETRY_CONDITION_NODE:
        arrows.push(
          ...arrowHelper.createRetryConditionNodeArrow(
            node.id,
            node.view as IRetryConditionView,
          ),
        );
        break;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        arrows.push(
          ...arrowHelper.createHasButtonsCarouselArrow(
            node.id,
            node.view as IHasButtonCarouselViewBase,
          ),
        );
        break;
      case NODE_TYPES.BASIC_CARD_NODE:
      case NODE_TYPES.LIST_CARD_NODE:
      case NODE_TYPES.PRODUCT_CARD_NODE:
        arrows.push(
          ...arrowHelper.createHasButtonsArrow(node.id, node.view as IHasButtonViewBase),
        );
        break;
    }

    return arrows;
  },
  syncArrow: (start: string, end?: string, node?: INode) => {
    if (!node) {
      return;
    }

    const startId = start.substring(5);
    const endId = end?.substring(5);

    if (start.startsWith(NODE_PREFIX)) {
      node.nextNodeId = endId;
    }

    switch (node.type) {
      case NODE_TYPES.ANSWER_NODE:
        node.nextNodeId = endId;
        arrowHelper.syncAnswerNodeArrow(startId, endId, node.view as IAnswerView);
        break;
      case NODE_TYPES.CONDITION_NODE:
      case NODE_TYPES.RETRY_CONDITION_NODE:
        arrowHelper.syncTrueFalseNodeArrow(
          startId,
          endId,
          node.view as ITrueFalseViewBase,
        );
        break;
      case NODE_TYPES.BASIC_CARD_NODE:
      case NODE_TYPES.LIST_CARD_NODE:
      case NODE_TYPES.PRODUCT_CARD_NODE:
        arrowHelper.syncHasButtonArrow(startId, endId, node.view as IHasButtonViewBase);
        break;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        arrowHelper.syncHasButtonCarouselArrow(
          startId,
          endId,
          node.view as IHasButtonCarouselViewBase,
        );
        break;
      case NODE_TYPES.INTENT_NODE:
      case NODE_TYPES.PARAMETER_SET_NODE:
        node.nextNodeId = endId;
        break;
    }
  },
  syncAnswerNodeArrow: (startId: string, endId?: string, view?: IAnswerView) => {
    if (!view) {
      return;
    }
    const found = view.quicks?.find((x) => x.id === startId);
    if (found) {
      found.actionType = ACTION_TYPES.LUNA_NODE_REDIRECT;
      found.actionValue = endId;
    }
  },
  syncTrueFalseNodeArrow: (
    startId: string,
    endId?: string,
    view?: ITrueFalseViewBase,
  ) => {
    if (!view) {
      return;
    }

    if (startId.endsWith(TRUE_SUFFIX)) {
      view.trueThenNextNodeId = endId;
    }

    if (startId.endsWith(FALSE_SUFFIX)) {
      view.falseThenNextNodeId = endId;
    }
  },
  syncHasButtonArrow: (startId: string, endId?: string, view?: IHasButtonViewBase) => {
    if (!view) {
      return;
    }
    const found = view.buttons?.find((x) => x.id === startId);
    if (found) {
      found.actionType = ACTION_TYPES.LUNA_NODE_REDIRECT;
      found.actionValue = endId;
    }
  },
  syncHasButtonCarouselArrow: (
    startId: string,
    endId?: string,
    view?: IHasButtonCarouselViewBase,
  ) => {
    if (!view) {
      return;
    }

    view?.childrenViews.map((v) => {
      const found = v.buttons?.find((x) => x.id === startId);
      if (found) {
        found.actionType = ACTION_TYPES.LUNA_NODE_REDIRECT;
        found.actionValue = endId;
      }
    });
  },

  validateArrows: (startId: string, endId: string, nodes: INode[], isNext?: boolean) => {
    console.log(startId, endId);
    // 자기 자신으로 연결한 경우
    if (startId === endId) {
      return '잘못된 연결입니다.';
    }

    const startNode = nodes.find((x) => x.id === startId.substring(5));
    const endNode = nodes.find((x) => x.id === endId.substring(5));

    // 노드가 없는경우
    if (!startNode || !endNode) {
      return '노드가 존재하지 않음.';
    }

    // 시작노드에 다른시나리오 연결한 경우
    if (
      isNext &&
      startNode.type === NODE_TYPES.INTENT_NODE &&
      endNode.type === NODE_TYPES.OTHER_FLOW_REDIRECT_NODE
    ) {
      return '시작노드에서 다른시나리오로 연결 할 수 없습니다.';
    }

    // Answer노드 앞에 응답이 없는경우
    if (isNext && endNode.type === NODE_TYPES.ANSWER_NODE) {
      return 'Answer노드는 다음노드로 지정할 수 없음';
    }

    // 연속 노드에 응답이 아닌 노드 연결 할 경우
    if (!isNext && endNode.nodeKind === NodeKind.CommandNode) {
      return '연속노드로 응답노드만 연결 할 수 있습니다.';
    }

    if (
      !isNext &&
      endNode.nodeKind === NodeKind.InputNode &&
      startNode.nodeKind === NodeKind.InputNode
    ) {
      const count = arrowHelper.checkParent(2, startNode.id, nodes);
      if (count > 3) {
        return '연속응답 노드는 3개까지만 가능합니다.';
      }
    }

    return undefined;
  },
  checkParent: (depth: number, nodeId: string, nodes: INode[]): number => {
    const parents = nodes.filter((x) => x.nextNodeId === nodeId);
    if (parents.length > 0) {
      const parentDepths = parents.map((p) => {
        if (p.nodeKind !== NodeKind.InputNode) {
          return depth;
        }
        return arrowHelper.checkParent(depth + 1, p.id, nodes);
      });
      return Math.max(...parentDepths);
    }

    return depth;
  },
};
