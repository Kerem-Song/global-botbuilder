import { INode } from '@models';
import {
  ACTION_TYPES,
  CTRL_TYPES,
  IConditionView,
  ICtrlBase,
  IHasChildrenView,
  INodeBase,
  ISwitchView,
  IViewBase,
} from '@models/interfaces/res/IGetFlowRes';

import { ID_GEN, ID_TYPES } from './idGen';

export const nodeHelper = {
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
  cloneNode: (node: INode) => {
    const { view, ...restProps } = node;
    const clone: INode = {
      ...restProps,
      id: ID_GEN.generate(ID_TYPES.NODE),
      nextNodeId: undefined,
    };

    if (view) {
      if (Object.keys(view).includes('childrenViews')) {
        clone.view = nodeHelper.cloneHasChildrenView(view as IHasChildrenView);
      } else if (Object.keys(view).includes('conditions')) {
        clone.view = nodeHelper.cloneSwitchView(view as ISwitchView);
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
  cloneSwitchView: (view: ISwitchView) => {
    const { conditions, ...restProps } = view;
    const cloneConditions = conditions?.map((x) => nodeHelper.cloneView(x));

    return {
      ...nodeHelper.cloneObject(restProps),
      id: ID_GEN.generate(ID_TYPES.VIEW),
      conditions: cloneConditions,
    };
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

    clone['nextNodeId'] = undefined;
    clone['falseThenNextNodeId'] = undefined;
    clone['trueThenNextNodeId'] = undefined;

    if (clone['actionType'] === ACTION_TYPES.LUNA_NODE_REDIRECT) {
      clone['actionValue'] = undefined;
    }

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
