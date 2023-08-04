import { IArrow, INode, INodeEditModel, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import {
  ACTION_TYPES,
  IAnswerView,
  IConditionView,
  IHasButtonCarouselViewBase,
  IHasButtonViewBase,
  INodeBase,
  IRetryConditionView,
  ISwitchView,
  ITrueFalseViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';

import {
  CONDITION_SUFFIX,
  DEFAULT_SUFFIX,
  FALSE_SUFFIX,
  NEXT_BUTTON_PREFIX,
  NODE_PREFIX,
  TRUE_SUFFIX,
} from './constants';
import { lunaToast } from './lunaToast';

const OVERFLOWLINK = 99999;

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
  NODE_TYPES.SWITCH_NODE,
  NODE_TYPES.RETRY_CONDITION_NODE,
  NODE_TYPES.PARAMETER_SET_NODE,
  NODE_TYPES.JSON_REQUEST_NODE,
  NODE_TYPES.DATA_BASIC_CARD_NODE,
  NODE_TYPES.DATA_LIST_CARD_NODE,
  NODE_TYPES.DATA_PRODUCT_CARD_NODE,
  NODE_TYPES.PARAMETER_CLEAR_NODE,
];

const invalidateConnectNoteType: TNodeTypes[] = [
  NODE_TYPES.OTHER_FLOW_REDIRECT_NODE,
  NODE_TYPES.INTENT_NODE,
  NODE_TYPES.RETRY_CONDITION_NODE,
  NODE_TYPES.PARAMETER_SET_NODE,
  NODE_TYPES.PARAMETER_CLEAR_NODE,
  NODE_TYPES.CS_CENTER_SCENE_NODE,
];

export const arrowHelper = {
  tc: (key: string) => {
    console.log(`tc is not set(key:${key})`);
    return '';
  },
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
  createAnswerNodeArrow: (
    nodeId: string,
    view?: IAnswerView,
    nextNodeId?: string,
  ): IArrow[] => {
    const result: IArrow[] = [];

    if (nextNodeId) {
      result.push(arrowHelper.createNextArrow(nodeId, nextNodeId));
    }

    view?.quicks?.map((x) => {
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
  createConditionNodeArrow: (nodeId: string, view?: IConditionView): IArrow[] => {
    const result: IArrow[] = [];
    if (view && view.falseThenNextNodeId) {
      result.push({
        start: `${NEXT_BUTTON_PREFIX}${nodeId}${FALSE_SUFFIX}`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.falseThenNextNodeId}`,
        isNextNode: true,
        type: 'red',
      });
    }

    if (view && view.trueThenNextNodeId) {
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
  createSwitchNodeArrow: (nodeId: string, view?: ISwitchView): IArrow[] => {
    const result: IArrow[] = [];
    if (view && view.defaultNextNodeId) {
      result.push({
        start: `${NEXT_BUTTON_PREFIX}${nodeId}${DEFAULT_SUFFIX}`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.defaultNextNodeId}`,
        isNextNode: true,
        type: 'red',
      });
    }

    if (view && view.childrenViews) {
      view.childrenViews?.map((condition) => {
        result.push({
          start: `${NEXT_BUTTON_PREFIX}${nodeId}${CONDITION_SUFFIX}${condition.id}`,
          updateKey: `${NODE_PREFIX}${nodeId}`,
          end: `${NODE_PREFIX}${condition.trueThenNextNodeId}`,
          isNextNode: true,
          type: 'green',
        });
      });
    }

    return result;
  },
  createRetryConditionNodeArrow: (
    nodeId: string,
    view?: IRetryConditionView,
  ): IArrow[] => {
    const result: IArrow[] = [];

    if (view && view.falseThenNextNodeId) {
      result.push({
        start: `${NEXT_BUTTON_PREFIX}${nodeId}${FALSE_SUFFIX}`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.falseThenNextNodeId}`,
        isNextNode: true,
        type: 'yellow',
      });
    }

    if (view && view.trueThenNextNodeId) {
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
  createHasButtonsArrow: (
    nodeId: string,
    view?: IHasButtonViewBase,
    nextNodeId?: string,
  ): IArrow[] => {
    const result: IArrow[] = [];

    if (nextNodeId) {
      result.push(arrowHelper.createConnectArrow(nodeId, nextNodeId));
    }

    view?.buttons?.forEach((b) => {
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

    return result;
  },
  createHasButtonsCarouselArrow: (
    nodeId: string,
    view?: IHasButtonCarouselViewBase,
    nextNodeId?: string,
  ): IArrow[] => {
    const result: IArrow[] = [];
    if (nextNodeId) {
      result.push(arrowHelper.createConnectArrow(nodeId, nextNodeId));
    }

    if (view) {
      result.push(
        ...view.childrenViews
          .map((view) => arrowHelper.createHasButtonsArrow(nodeId, view))
          .flat(1),
      );
    }
    return result;
  },

  editArrows: (node: INodeEditModel, arrows: IArrow[]): IArrow[] | undefined => {
    if (!editableArrowNodeTypes.includes(node.type)) {
      return undefined;
    }

    const removeArrows = arrows.filter(
      (x) =>
        x.updateKey === `${NODE_PREFIX}${node.id}` ||
        x.start === `${NODE_PREFIX}${node.id}`,
    );

    console.log('removeArrows', removeArrows);
    if (removeArrows.length) {
      removeArrows.forEach((arrow) => {
        const index = arrows.indexOf(arrow);
        arrows.splice(index, 1);
      });
    }

    arrows.push(
      ...(nodeFactory
        .getFactory(node.type)
        ?.createArrows(node.id, node.nextNodeId, node.view) || []),
    );

    return arrows;
  },

  initArrows: (node: INodeBase): IArrow[] => {
    const arrows: IArrow[] = [];
    arrows.push(
      ...(nodeFactory
        .getFactory(node.typeName)
        ?.createArrows(node.id, node.nextNodeId, node.view) || []),
    );
    return arrows;
  },

  syncArrow: (start: string, end?: string, node?: INode) => {
    if (!node) {
      return;
    }

    const startId = start.substring(5);
    const endId = end?.substring(5);

    const syncNextNodeType: TNodeTypes[] = [
      NODE_TYPES.ANSWER_NODE,
      NODE_TYPES.INTENT_NODE,
      NODE_TYPES.PARAMETER_SET_NODE,
      NODE_TYPES.JSON_REQUEST_NODE,
      NODE_TYPES.PARAMETER_CLEAR_NODE,
    ];

    if (
      start.startsWith(NODE_PREFIX) ||
      (syncNextNodeType.includes(node.type) && start.substring(5).startsWith('node'))
    ) {
      node.nextNodeId = endId;
    }

    nodeFactory.getFactory(node.type)?.syncArrow(startId, endId, node.view);
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
  syncConditionFalseNodeArrow: (startId: string, endId?: string, view?: ISwitchView) => {
    if (!view) {
      return;
    }

    if (startId.includes(CONDITION_SUFFIX))
      view.childrenViews?.map((condition, i) => {
        if (startId.endsWith(CONDITION_SUFFIX + condition.id)) {
          condition.trueThenNextNodeId = endId;
        }
      });

    if (startId.endsWith(DEFAULT_SUFFIX)) {
      view.defaultNextNodeId = endId;
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
    // console.log(startId, endId);
    // 자기 자신으로 연결한 경우
    if (startId === endId) {
      //console.log('잘못된 연결입니다.');
      return arrowHelper.tc('INVALIDATE_ARROW');
    }

    const startNode = nodes.find((x) => x.id === startId.substring(5));
    const endNode = nodes.find((x) => x.id === endId.substring(5));

    // 노드가 없는경우
    if (!startNode || !endNode) {
      //console.log('노드가 존재하지 않음.');
      return arrowHelper.tc('INVALIDATE_ARROW');
    }

    //console.log('validateArrows', startId, startNode.title, endId, endNode.title);

    // 시작노드에 다른시나리오 연결한 경우
    if (
      isNext &&
      startNode.type === NODE_TYPES.INTENT_NODE &&
      endNode.type === NODE_TYPES.OTHER_FLOW_REDIRECT_NODE
    ) {
      //console.log('시작노드에서 다른시나리오로 연결 할 수 없습니다.');
      return arrowHelper.tc('INVALIDATE_ARROW');
    }

    // Answer노드 앞에 응답이 없는경우
    if (isNext && endNode.type === NODE_TYPES.ANSWER_NODE) {
      //console.log('Answer노드는 다음노드로 지정할 수 없음');
      return arrowHelper.tc('INVALIDATE_ARROW');
    }

    // 시작노드에서 Count노드 제외
    if (
      isNext &&
      startNode.type === NODE_TYPES.INTENT_NODE &&
      endNode.type === NODE_TYPES.RETRY_CONDITION_NODE
    ) {
      //console.log('Count노드는 다음 노드로 지정할 수 없음');
      return arrowHelper.tc('INVALIDATE_ARROW');
    }

    // 연속 노드에 응답이 아닌 노드 연결 할 경우
    // 연속 노드에 다른시나리오나 시작노드 연결 할 경우
    if (!isNext && invalidateConnectNoteType.includes(endNode.type)) {
      //console.log('연속노드로 응답노드만 연결 할 수 있습니다.');
      return arrowHelper.tc('INVALIDATE_ARROW');
    }

    const isPassChild =
      startNode.type === NODE_TYPES.ANSWER_NODE ||
      (startNode.nodeKind === NodeKind.InputNode && isNext);
    const depth =
      (startNode.nodeKind === NodeKind.InputNode && !isNext ? 1 : 0) +
      (!isPassChild && endNode.nodeKind === NodeKind.InputNode ? 1 : 0);
    const parentCnt = isPassChild
      ? 0
      : arrowHelper.checkParent(depth, startNode.id, startNode.id, endNode.id, nodes);

    const childCnt = isPassChild
      ? 0
      : arrowHelper.checkChild(
          0,
          startNode.id,
          endNode.id,
          nodes,
          nodeFactory.getFactory(endNode.type)?.getConnectId(endNode) || [],
        );

    if (parentCnt === OVERFLOWLINK || childCnt === OVERFLOWLINK) {
      //console.log('응답을 순환으로 설정할 수 없습니다.');
      return arrowHelper.tc('INVALIDATE_ARROW');
    }

    if (parentCnt + childCnt > 3) {
      //console.log('말풍선 세로 나열은 최대 3개까지 가능합니다.');
      return arrowHelper.tc('INVALIDATE_MAX_3_INPUT_NODE');
    }

    return undefined;
  },
  checkParent: (
    depth: number,
    nodeId: string,
    startId: string,
    endId: string,
    nodes: INode[],
  ): number => {
    const parents = nodes.filter((x) =>
      nodeFactory.getFactory(x.type)?.getConnectId(x).includes(nodeId),
    );

    if (parents.find((x) => x.id === endId || x.id === startId)) {
      return OVERFLOWLINK;
    }

    if (parents.length > 0) {
      const parentDepths = parents.map((p) => {
        // console.log(
        //   '%parent%',
        //   p.id,
        //   p.type,
        //   p.nodeKind,
        //   nodeFactory.getFactory(p.type)?.getConnectId(p),
        // );
        return arrowHelper.checkParent(
          p.nodeKind === NodeKind.InputNode ? depth + 1 : depth,
          p.id,
          startId,
          endId,
          nodes,
        );
      });
      return Math.max(...parentDepths);
    }

    return depth;
  },
  checkChild: (
    depth: number,
    startId: string,
    endId: string,
    nodes: INode[],
    nextNodeId: string[],
  ): number => {
    if (nextNodeId.length === 0) {
      return depth;
    }

    if (nextNodeId.includes(startId) || nextNodeId.includes(endId)) {
      return OVERFLOWLINK;
    }

    const children = nodes.filter((x) => nextNodeId.includes(x.id));
    if (children.length > 0) {
      const childrenDepths = children.map((c) => {
        if (c.nodeKind !== NodeKind.InputNode) {
          return arrowHelper.checkChild(
            depth,
            startId,
            endId,
            nodes,
            nodeFactory.getFactory(c.type)?.getConnectId(c) || [],
          );
        }
        return arrowHelper.checkChild(
          depth + 1,
          startId,
          endId,
          nodes,
          nodeFactory.getFactory(c.type)?.getConnectId(c) || [],
        );
      });

      return Math.max(...childrenDepths);
    }

    return depth;
  },
};
