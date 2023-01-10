import {
  CARD_TYPES,
  IAnswerNode,
  IBasicCard,
  IBasicCardNode,
  ICommerceCard,
  ICondition,
  IConditionNode,
  ICount,
  ICountNode,
  IListCard,
  IListNode,
  IProductCardNode,
  IQuickReply,
  NODE_TYPES,
  TCardsValues,
} from '@models/interfaces/ICard';
import { v4 as uuidv4 } from 'uuid';

import { TNodeTypes } from './../../models/interfaces/ICard';

export const defaultNode = (nodeType: TNodeTypes) => {
  let addNode:
    | IBasicCardNode[]
    | IProductCardNode[]
    | IListNode[]
    | IAnswerNode[]
    | IConditionNode[]
    | ICountNode[] = [];

  switch (nodeType) {
    case NODE_TYPES.TEXT_NODE:
    case NODE_TYPES.IMAGE_NODE:
    case NODE_TYPES.BASIC_CARD_NODE:
      addNode = [
        {
          type:
            nodeType === NODE_TYPES.TEXT_NODE
              ? NODE_TYPES.TEXT_NODE
              : nodeType === NODE_TYPES.IMAGE_NODE
              ? NODE_TYPES.IMAGE_NODE
              : NODE_TYPES.BASIC_CARD_NODE,
          title: nodeType === NODE_TYPES.IMAGE_NODE ? undefined : '',
          thumbnail: nodeType === NODE_TYPES.TEXT_NODE ? undefined : { imageUrl: '' },
          description: nodeType === NODE_TYPES.IMAGE_NODE ? undefined : '',
          buttons:
            nodeType === NODE_TYPES.TEXT_NODE || nodeType === NODE_TYPES.IMAGE_NODE
              ? undefined
              : [
                  { id: uuidv4(), label: 'Button 01', action: 'block' },
                  { id: uuidv4(), label: 'Button 02', action: 'block' },
                ],
        },
      ];
      break;

    case NODE_TYPES.PRODUCT_CARD_NODE:
      addNode = [
        {
          type: NODE_TYPES.PRODUCT_CARD_NODE,
          price: 0,
          currency: 'USD', // 파트너스센터 설정에 따라 코드 변경 필요
          thumbnail: { imageUrl: '' },
          profile: { brandName: '', imageUrl: '' },
          productName: '',
        },
      ];
      break;

    case NODE_TYPES.LIST:
      addNode = [
        {
          type: NODE_TYPES.LIST,
          header: {
            title: '',
          },
          thumbnail: { imageUrl: '' },
          items: [
            {
              id: uuidv4(),
              thumbnail: { imageUrl: '' },
              title: '',
              description: '',
            },
          ],
        },
      ];
      break;

    case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
      addNode = [
        {
          type: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
          title: '',
          thumbnail: { imageUrl: '' },
          description: '',
          buttons: [{ id: uuidv4(), label: 'Button 01', action: 'block' }],
        },
        {
          buttons: [{ id: uuidv4(), label: '+ Add a ChatBubble', action: 'block' }],
        },
      ];
      break;

    case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
      addNode = [
        {
          type: NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE,
          price: 0,
          currency: 'USD', // 파트너스센터 설정에 따라 코드 변경 필요
          thumbnail: { imageUrl: '' },
          profile: { brandName: '', imageUrl: '' },
          productName: '',
        },
        {
          buttons: [{ id: uuidv4(), label: '+ Add a ChatBubble', action: 'block' }],
        },
      ];
      break;

    case NODE_TYPES.LIST_CAROUSEL:
      addNode = [
        {
          type: NODE_TYPES.LIST_CAROUSEL,
          header: {
            title: '',
          },
          thumbnail: { imageUrl: '' },
          items: [
            {
              id: uuidv4(),
              thumbnail: { imageUrl: '' },
              title: '',
              description: '',
            },
          ],
        },
        {
          buttons: [{ id: uuidv4(), label: '+ Add a ChatBubble', action: 'block' }],
        },
      ];
      break;

    case NODE_TYPES.ANSWER_NODE:
      addNode = [
        {
          type: NODE_TYPES.ANSWER_NODE,
          label: '',
          action: 'block',
          blockId: '',
        },
      ];
      break;

    case NODE_TYPES.CONDITION_NODE:
      addNode = [
        {
          type: NODE_TYPES.CONDITION_NODE,
          title: '',
          greenNode: '',
          redNode: '',
          condition: null,
        },
      ];
      break;

    case NODE_TYPES.COUNT:
      addNode = [
        {
          type: NODE_TYPES.COUNT,
          title: '',
          yellowNode: '',
          redNode: '',
          requestionNum: 0,
          requestionConnectedMessage: '',
          excessiveLimitedNumMessage: '',
        },
      ];
      break;
  }

  return addNode;
};
