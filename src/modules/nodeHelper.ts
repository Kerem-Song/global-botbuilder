import {
  ConditionJoin,
  ConditionOperator,
  IArrow,
  INode,
  INodeEditModel,
  NODE_TYPES,
  NodeKind,
  TNodeTypes,
  VIEW_TYPES,
} from '@models';
import {
  ACTION_TYPES,
  CTRL_TYPES,
  IAnswerNode,
  IAnswerView,
  IBasicCardCarouselNode,
  IBasicCardCarouselView,
  IBasicCardNode,
  IBasicCardView,
  IConditionNode,
  IConditionView,
  ICtrlBase,
  IHasButtonCarouselViewBase,
  IHasButtonViewBase,
  IHasChildrenView,
  IListCardCarouselView,
  IListCardView,
  INodeBase,
  IOtherFlowRedirectView,
  IParameterSetNode,
  IParameterSetParams,
  IParameterSetView,
  IProductCardCarouselView,
  IProductCardView,
  IRetryConditionNode,
  IRetryConditionView,
  ITextView,
  ITrueFalseViewBase,
  IViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { arrow } from '@popperjs/core';

import { FALSE_SUFFIX, NEXT_BUTTON_PREFIX, NODE_PREFIX, TRUE_SUFFIX } from './constants';
import { ID_GEN, ID_TYPES } from './idGen';

const editableArrowNodeTypes: string[] = [
  NODE_TYPES.ANSWER_NODE,
  NODE_TYPES.BASIC_CARD_NODE,
  NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
  NODE_TYPES.CONDITION_NODE,
  NODE_TYPES.RETRY_CONDITION_NODE,
  NODE_TYPES.PARAMETER_SET_NODE,
];

export const nodeHelper = {
  createDefaultView: (nodeType: TNodeTypes) => {
    switch (nodeType) {
      case NODE_TYPES.TEXT_NODE:
        return nodeHelper.createDefaultTextView();
      case NODE_TYPES.BASIC_CARD_NODE:
        return nodeHelper.createDefaultBasicCardView();
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        return nodeHelper.createDefaultBasicCardCarouselView();
      case NODE_TYPES.LIST_CARD_NODE:
        return nodeHelper.createDefaultListCardView();
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
        return nodeHelper.createDefaultListCardCarouselView();
      case NODE_TYPES.CONDITION_NODE:
        return nodeHelper.createDefaultConditionView();
      case NODE_TYPES.ANSWER_NODE:
        return nodeHelper.createDefaultAnswerView();
      case NODE_TYPES.PARAMETER_SET_NODE:
        return nodeHelper.createDefaultParameterSetView();
      case NODE_TYPES.OTHER_FLOW_REDIRECT_NODE:
        return nodeHelper.createDefaultOtherFlowRedirectView();
      case NODE_TYPES.PRODUCT_CARD_NODE:
        return nodeHelper.createCommerceView();
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        return nodeHelper.createCommerceCarouselView();
      case NODE_TYPES.RETRY_CONDITION_NODE:
        return nodeHelper.createDefaultRetryConditionView();
      default:
        return undefined;
    }
  },
  createDefaultRetryConditionView: () => {
    const result: IRetryConditionView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.RETRY_CONDITION_VIEW,
      count: 1,
    };

    return result;
  },
  createDefaultTextView: () => {
    const result: ITextView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      text: '',
      typeName: VIEW_TYPES.TEXT_VIEW,
    };

    return result;
  },
  createDefaultBasicCardView: () => {
    const result: IBasicCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.BASIC_CARD_VIEW,
      title: '',
      description: '',
      imageCtrl: {
        imageUrl: '',
        altText: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
      },
      buttons: [nodeHelper.createDefaultButtonCtrl()],
    };

    return result;
  },
  createDefaultButtonCtrl: (index = 0) => {
    return {
      id: ID_GEN.generate(ID_TYPES.CTRL),
      label: `버튼 ${index + 1}`,
      seq: index,
      typeName: CTRL_TYPES.BUTTON_CTRL,
      actionType: ACTION_TYPES.LUNA_NODE_REDIRECT,
    };
  },
  createDefaultBasicCardCarouselView: () => {
    const result: IBasicCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.BASIC_CARD_VIEW,
      childrenViews: [nodeHelper.createDefaultBasicCardView()],
      isSuffle: false,
      count: 10,
    };

    return result;
  },
  createDefaultConditionView: () => {
    const result: IConditionView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.CONDITION_VIEW,
      items: [{ op1: '', operator: ConditionOperator.Is, op2: '' }],
      join: ConditionJoin.And,
    };

    return result;
  },
  createDefaultAnswerView: () => {
    const result: IAnswerView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.ANSWER_VIEW,
      quicks: [nodeHelper.createDefaultAnswerQickItem(0)],
    };

    return result;
  },
  createDefaultAnswerQickItem: (index: number) => {
    const result = {
      id: ID_GEN.generate(ID_TYPES.CTRL),
      label: `퀵 리플라이 ${index + 1}`,
      seq: index,
      typeName: CTRL_TYPES.QUICK_CTRL,
      actionType: ACTION_TYPES.LUNA_NODE_REDIRECT,
    };
    return result;
  },
  createDefaultParameterSetView: () => {
    const result = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.PARAMETER_SET_NODE_VIEW,
      parameters: [{ name: '', value: '' }],
    };

    return result;
  },
  createDefaultParameterSetParams: () => {
    const result: IParameterSetParams = {
      name: '',
      value: '',
    };

    return result;
  },
  createDefaultOtherFlowRedirectView: () => {
    const result: IOtherFlowRedirectView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.OTHER_FLOW_REDIRECT_VIEW,
    };
    return result;
  },
  createDefaultListCardView: () => {
    const result: IListCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.LIST_CARD_VIEW,
      header: '',
      seq: 0,
      items: [],
      imageCtrl: {
        imageUrl: '',
        altText: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
      },
      buttons: [nodeHelper.createDefaultButtonCtrl()],
    };

    return result;
  },
  createDefaultListCardCarouselView: () => {
    const result: IListCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.LIST_CARD_CAROUSEL_VIEW,
      childrenViews: [nodeHelper.createDefaultListCardView()],
      isSuffle: false,
      count: 10,
    };

    return result;
  },
  createCommerceView: () => {
    const result: IProductCardView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.PRODUCT_CARD_VIEW,
      retailPrice: 0,
      salePrice: 0,
      profileIconUrl: '',
      profileName: '',
      description: '',
      seq: 0,
      currencyUnit: 'KRW',
      imageCtrl: {
        imageUrl: '',
        altText: '',
        id: ID_GEN.generate(ID_TYPES.CTRL),
        typeName: CTRL_TYPES.IMAGE_CTRL,
      },
      buttons: [nodeHelper.createDefaultButtonCtrl()],
    };

    return result;
  },
  createCommerceCarouselView: () => {
    const result: IProductCardCarouselView = {
      id: ID_GEN.generate(ID_TYPES.VIEW),
      typeName: VIEW_TYPES.PRODUCT_CARD_CAROUSEL_VIEW,
      childrenViews: [nodeHelper.createCommerceView()],
      isSuffle: false,
      count: 10,
    };
    return result;
  },
  convertToINodeBase: (node: INode): INodeBase => {
    const converted: INodeBase = {
      id: node.id,
      alias: node.title || '',
      left: node.x,
      top: node.y,
      typeName: node.type,
      nodeKind: node.nodeKind,
      option: node.option,
      seq: node.seq,
      nextNodeId: node.nextNodeId,
      view: node.view ? { ...node.view } : undefined,
    };

    return converted;
  },
  convertToINode: (node: INodeBase): INode => {
    return {
      id: node.id,
      title: node.alias,
      x: node.left,
      y: node.top,
      type: node.typeName,
      nodeKind: node.nodeKind,
      option: node.option,
      seq: node.seq,
      nextNodeId: node.nextNodeId,
      view: node.view,
    };
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
    console.log('view in create retry condition node arrow', view);
    if (view.falseThenNextNodeId) {
      console.log('view.falseThenNextNodeId', view.falseThenNextNodeId);
      result.push({
        start: `${NEXT_BUTTON_PREFIX}${nodeId}${FALSE_SUFFIX}`,
        updateKey: `${NODE_PREFIX}${nodeId}`,
        end: `${NODE_PREFIX}${view.falseThenNextNodeId}`,
        isNextNode: true,
        type: 'yellow',
      });
    }

    if (view.trueThenNextNodeId) {
      console.log('view.trueThenNextNodeId', view.trueThenNextNodeId);
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

  createParameterSetNodeArrow: (
    nodeId: string,
    nextNodeId: INodeEditModel['nextNodeId'],
  ): IArrow[] => {
    const result: IArrow[] = [];
    result.push({
      start: `${NEXT_BUTTON_PREFIX}${nodeId}`,
      updateKey: `${NODE_PREFIX}${nodeId}`,
      end: `${NODE_PREFIX}${nextNodeId}`,
      isNextNode: true,
      type: 'blue',
    });

    return result;
  },

  createBasicCardArrow: (nodeId: string, view: IBasicCardView): IArrow[] => {
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
    return result;
  },
  createBasicCardCarouselArrow: (
    nodeId: string,
    view: IBasicCardCarouselView,
  ): IArrow[] => {
    const result: IArrow[] = [];
    result.push(
      ...view.childrenViews
        .map((view) => nodeHelper.createBasicCardArrow(nodeId, view))
        .flat(1),
    );
    return result;
  },
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

    switch (node.type) {
      case NODE_TYPES.ANSWER_NODE:
        arrows.push(
          ...nodeHelper.createAnswerNodeArrow(node.id, node.view as IAnswerView),
        );
        break;
      case NODE_TYPES.BASIC_CARD_NODE:
        arrows.push(
          ...nodeHelper.createBasicCardArrow(node.id, node.view as IBasicCardView),
        );
        break;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        arrows.push(
          ...nodeHelper.createBasicCardCarouselArrow(
            node.id,
            node.view as IBasicCardCarouselView,
          ),
        );
        break;
      case NODE_TYPES.CONDITION_NODE:
        arrows.push(
          ...nodeHelper.createConditionNodeArrow(node.id, node.view as IConditionView),
        );
        break;
      case NODE_TYPES.RETRY_CONDITION_NODE:
        arrows.push(
          ...nodeHelper.createRetryConditionNodeArrow(
            node.id,
            node.view as IRetryConditionView,
          ),
        );
        break;
      case NODE_TYPES.PARAMETER_SET_NODE:
        arrows.push(
          ...nodeHelper.createParameterSetNodeArrow(
            node.id,
            node.nextNodeId as INodeEditModel['nextNodeId'],
          ),
        );
    }

    return arrows;
  },

  initArrows: (node: INodeBase): IArrow[] => {
    const arrows: IArrow[] = [];
    if (node.nextNodeId) {
      if (node.nodeKind === NodeKind.InputNode) {
        arrows.push(nodeHelper.createConnectArrow(node.id, node.nextNodeId));
      } else if (node.typeName !== NODE_TYPES.OTHER_FLOW_REDIRECT_NODE) {
        arrows.push(nodeHelper.createNextArrow(node.id, node.nextNodeId));
      }
    }

    if (node.typeName === NODE_TYPES.ANSWER_NODE) {
      const answerNode: IAnswerNode = node as IAnswerNode;
      arrows.push(...nodeHelper.createAnswerNodeArrow(answerNode.id, answerNode.view));
    }

    if (node.typeName === NODE_TYPES.CONDITION_NODE) {
      const conditionNode: IConditionNode = node as IConditionNode;
      arrows.push(
        ...nodeHelper.createConditionNodeArrow(conditionNode.id, conditionNode.view),
      );
    }

    if (node.typeName === NODE_TYPES.RETRY_CONDITION_NODE) {
      const retryConditionNode: IRetryConditionNode = node as IRetryConditionNode;
      arrows.push(
        ...nodeHelper.createRetryConditionNodeArrow(
          retryConditionNode.id,
          retryConditionNode.view,
        ),
      );
    }

    if (node.typeName === NODE_TYPES.PARAMETER_SET_NODE) {
      const parameterSetNode: IParameterSetNode = node as IParameterSetNode;
      arrows.push(
        ...nodeHelper.createParameterSetNodeArrow(
          parameterSetNode.id,
          parameterSetNode.nextNodeId,
        ),
      );
    }

    if (node.typeName === NODE_TYPES.BASIC_CARD_CAROUSEL_NODE) {
      const cardCarouselNode: IBasicCardCarouselNode = node as IBasicCardCarouselNode;
      arrows.push(
        ...nodeHelper.createBasicCardCarouselArrow(
          cardCarouselNode.id,
          cardCarouselNode.view,
        ),
      );
    }

    if (node.typeName === NODE_TYPES.BASIC_CARD_NODE) {
      const cardNode: IBasicCardNode = node as IBasicCardNode;
      arrows.push(...nodeHelper.createBasicCardArrow(cardNode.id, cardNode.view));
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
        nodeHelper.syncAnswerNodeArrow(startId, endId, node.view as IAnswerView);
        break;
      case NODE_TYPES.CONDITION_NODE:
      case NODE_TYPES.RETRY_CONDITION_NODE:
        nodeHelper.syncTrueFalseNodeArrow(
          startId,
          endId,
          node.view as ITrueFalseViewBase,
        );
        break;
      case NODE_TYPES.BASIC_CARD_NODE:
      case NODE_TYPES.LIST_CARD_NODE:
      case NODE_TYPES.PRODUCT_CARD_NODE:
        nodeHelper.syncHasButtonArrow(startId, endId, node.view as IHasButtonViewBase);
        break;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        nodeHelper.syncHasButtonCarouselArrow(
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

    console.log(startId);
    console.log(endId);

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
  syncListCardArrow: (startId: string, endId?: string, view?: IListCardView) => {
    if (!view) {
      return;
    }
    const found = view.buttons?.find((x) => x.id === startId);
    if (found) {
      found.actionType = ACTION_TYPES.LUNA_NODE_REDIRECT;
      found.actionValue = endId;
    }
  },
  syncListCardCarouselArrow: (
    startId: string,
    endId?: string,
    view?: IListCardCarouselView,
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
    // 자기 자신으로 연결한 경우
    if (startId === endId) {
      return '자기 자신을 연결했음.';
    }

    const startNode = nodes.find((x) => x.id === startId.substring(5));
    const endNode = nodes.find((x) => x.id === endId.substring(5));

    // 노드가 없는경우
    if (!startNode || !endNode) {
      return '노드가 존재하지 않음.';
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
      endNode.nodeKind === NodeKind.InputNode &&
      startNode.nodeKind === NodeKind.InputNode
    ) {
      const count = nodeHelper.checkParent(2, startNode.id, nodes);
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
        return nodeHelper.checkParent(depth + 1, p.id, nodes);
      });
      return Math.max(...parentDepths);
    }

    return depth;
  },
  cloneNode: (node: INode) => {
    const { view, ...restProps } = node;
    const clone: INode = {
      ...restProps,
      id: ID_GEN.generate(ID_TYPES.NODE),
    };

    if (view) {
      if (Object.keys(view).includes('childrenViews')) {
        clone.view = nodeHelper.cloneHasChildrenView(view as IHasChildrenView);
      } else {
        clone.view = nodeHelper.cloneView(view);
      }
    }

    return clone;
  },
  cloneHasChildrenView: (view: IHasChildrenView) => {
    const { childrenViews, ...restProps } = view;
    const cloneChildrenViews = childrenViews.map((x) => nodeHelper.cloneView(x));

    return {
      ...nodeHelper.cloneObject(restProps),
      id: ID_GEN.generate(ID_TYPES.VIEW),
      childrenViews: cloneChildrenViews,
    };
  },
  cloneView: (view: IViewBase) => {
    const clone = {
      ...nodeHelper.cloneObject(view),
      id: ID_GEN.generate(ID_TYPES.VIEW),
    };

    return clone;
  },
  cloneObject: (obj: object) => {
    const arrays = nodeHelper.filterArray(obj);
    const ctrls = nodeHelper.filterCtrl(obj);
    const clone = {
      ...JSON.parse(JSON.stringify(obj)),
    };
    arrays.map(([key, value]) => {
      const cloneArray = value.map((v: object) => {
        if (nodeHelper.isCtrlObject(v)) {
          return nodeHelper.cloneCtrl(v as ICtrlBase);
        }
        return nodeHelper.cloneObject(v);
      });

      clone[key] = cloneArray;
    });

    ctrls.map(([key, value]) => {
      clone[key] = nodeHelper.cloneCtrl(value);
    });

    return clone;
  },
  filterArray: (obj: object) => {
    const arrays = Object.entries(obj).filter(([key, value]) => {
      if (!value) {
        return false;
      }

      if (Array.isArray(value)) {
        return true;
      }
      return false;
    });
    return arrays;
  },
  isCtrlObject: (obj: object) => {
    const ctrlTypeNames = Object.values(CTRL_TYPES);
    const controls = Object.entries(obj).filter(([key, value]) => {
      if (
        key === 'typeName' &&
        typeof value === 'string' &&
        ctrlTypeNames.includes(value)
      ) {
        return true;
      }
      return false;
    });

    if (controls.length > 0) {
      return true;
    }

    return false;
  },
  filterCtrl: (obj: object) => {
    const ctrls = Object.entries(obj).filter(([key, value]) => {
      if (!value) {
        return false;
      }
      if (typeof value === 'object') {
        return nodeHelper.isCtrlObject(value);
      }

      return false;
    });
    return ctrls;
  },
  cloneCtrl: (ctrl: ICtrlBase) => {
    const ctrls = nodeHelper.filterCtrl(ctrl);
    const clone = {
      ...nodeHelper.cloneObject(ctrl),
      id: ID_GEN.generate(ID_TYPES.CTRL),
    };

    ctrls.map(([key, value]) => {
      clone[key] = nodeHelper.cloneCtrl(value);
    });

    return clone;
  },
};
