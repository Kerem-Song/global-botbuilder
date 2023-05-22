import { IArrow, INode, INodeEditModel, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IViewBase } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

import { AnswerNodeFactory } from './AnswerNodeFactory';
import { BasicCardCarouselNodeFactory } from './BasicCardCarouselNodeFactory';
import { BasicCardNodeFactory } from './BasicCardNodeFactory';
import { ConditionNodeFactory } from './ConditionNodeFactory';
import { DataBasicCardNodeFactory } from './DataBasicCardNodeFactory';
import { DataListCardNodeFactory } from './DataListCardNodeFactory';
import { DataProductCardNodeFactory } from './DataProductCardNodeFactory';
import { IntentNodeFactory } from './IntentNodeFactory';
import { JsonRequestNodeFactory } from './JsonRequestNodeFactory';
import { ListCardCarouselNodeFactory } from './ListCardCarouselNodeFactory';
import { ListCardNodeFactory } from './ListCardNodeFactory';
import { OtherFlowRedirectNodeFactory } from './OtherFlowRedirectNodeFactory';
import { ParameterSetNodeFactory } from './ParameterSetNodeFactory';
import { ProductCardCarouselNodeFactory } from './ProductCardCarouselNodeFactory';
import { ProductCardNodeFactory } from './ProductCardNodeFactory';
import { RetryConditionNodeFactory } from './RetryConditionNodeFactory';
import { TextNodeFactory } from './TextNodeFactory';

export interface INodeFactory {
  typeName: TNodeTypes;
  nodeKind: NodeKind;
  NodeContextMenuKinds: NodeContextMenuKind;
  getNodeImgIconUrl: () => string;
  getDefaultView: () => IViewBase;
  getEditElement: () => () => JSX.Element;
  getNodeElement: () => FC<IHasNode>;
  getConnectId: (node: INode) => string[];
  createArrows: (nodeId: string, nextNodeId?: string, view?: IViewBase) => IArrow[];
  syncArrow: (startId: string, endId?: string, view?: IViewBase) => void;
}

const intentNodeFactory = new IntentNodeFactory();
const textNodeFactory = new TextNodeFactory();
const basicCardNodeFactory = new BasicCardNodeFactory();
const basicCardCarouselNodeFactory = new BasicCardCarouselNodeFactory();
const listCardNodeFactory = new ListCardNodeFactory();
const listCardCarouselNodeFactory = new ListCardCarouselNodeFactory();
const conditionNodeFactory = new ConditionNodeFactory();
const answerNodeFactory = new AnswerNodeFactory();
const parameterSetNodeFactory = new ParameterSetNodeFactory();
const otherFlowRedirectNodeFactory = new OtherFlowRedirectNodeFactory();
const productCardNodeFactory = new ProductCardNodeFactory();
const productCardCarouselNodeFactory = new ProductCardCarouselNodeFactory();
const retryConditionNodeFactory = new RetryConditionNodeFactory();
const jsonRequestNodeFactory = new JsonRequestNodeFactory();
const dataBasicCardNodeFactory = new DataBasicCardNodeFactory();
const dataProductCardNodeFactory = new DataProductCardNodeFactory();
const dataListCardNodeFactory = new DataListCardNodeFactory();

export const nodeFactory = {
  getFactory: (TNodeTypes: TNodeTypes | undefined): INodeFactory | undefined => {
    switch (TNodeTypes) {
      case NODE_TYPES.INTENT_NODE:
        return intentNodeFactory;
      case NODE_TYPES.TEXT_NODE:
        return textNodeFactory;
      case NODE_TYPES.BASIC_CARD_NODE:
        return basicCardNodeFactory;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        return basicCardCarouselNodeFactory;
      case NODE_TYPES.LIST_CARD_NODE:
        return listCardNodeFactory;
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
        return listCardCarouselNodeFactory;
      case NODE_TYPES.CONDITION_NODE:
        return conditionNodeFactory;
      case NODE_TYPES.ANSWER_NODE:
        return answerNodeFactory;
      case NODE_TYPES.PARAMETER_SET_NODE:
        return parameterSetNodeFactory;
      case NODE_TYPES.OTHER_FLOW_REDIRECT_NODE:
        return otherFlowRedirectNodeFactory;
      case NODE_TYPES.PRODUCT_CARD_NODE:
        return productCardNodeFactory;
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        return productCardCarouselNodeFactory;
      case NODE_TYPES.RETRY_CONDITION_NODE:
        return retryConditionNodeFactory;
      case NODE_TYPES.JSON_REQUEST_NODE:
        return jsonRequestNodeFactory;
      case NODE_TYPES.DATA_BASIC_CARD_NODE:
        return dataBasicCardNodeFactory;
      case NODE_TYPES.DATA_PRODUCT_CARD_NODE:
        return dataProductCardNodeFactory;
      case NODE_TYPES.DATA_LIST_CARD_NODE:
        return dataListCardNodeFactory;

      default:
        return undefined;
    }
  },
};
