import {
  CARD_TYPES,
  IBasicCard,
  ICommerceCard,
  ICondition,
  ICount,
  IListCard,
  IQuickReply,
  TCardsValues,
  TDefaultCard,
} from '@models/interfaces/ICard';

export const defaultCards = (cardType: TCardsValues) => {
  let addCard:
    | IBasicCard[]
    | ICommerceCard[]
    | IListCard[]
    | IQuickReply[]
    | ICondition[]
    | ICount[] = [];

  switch (cardType) {
    case CARD_TYPES.TEXT:
    case CARD_TYPES.IMAGE:
    case CARD_TYPES.BUTTON_TEMPLATE:
      addCard = [
        {
          type:
            cardType === CARD_TYPES.TEXT
              ? CARD_TYPES.TEXT
              : cardType === CARD_TYPES.IMAGE
              ? CARD_TYPES.IMAGE
              : CARD_TYPES.BUTTON_TEMPLATE,
          title: cardType === CARD_TYPES.IMAGE ? undefined : '',
          thumbnail: cardType === CARD_TYPES.TEXT ? undefined : { imageUrl: '' },
          description: cardType === CARD_TYPES.IMAGE ? undefined : '',
          buttons:
            cardType === CARD_TYPES.TEXT || cardType === CARD_TYPES.IMAGE
              ? undefined
              : [
                  { id: 1, label: 'Button 01', action: 'block' },
                  { id: 2, label: 'Button 02', action: 'block' },
                  { id: 3, label: 'Button 03', action: 'block' },
                ],
        },
      ];
      break;

    case CARD_TYPES.COMMERCE:
      addCard = [
        {
          type: CARD_TYPES.COMMERCE,
          price: 0,
          currency: 'USD', // 파트너스센터 설정에 따라 코드 변경 필요
          thumbnail: { imageUrl: '' },
          profile: { brandName: '', imageUrl: '' },
          productName: '',
        },
      ];
      break;

    case CARD_TYPES.LIST:
      addCard = [
        {
          type: CARD_TYPES.LIST,
          header: {
            title: '',
          },
          thumbnail: { imageUrl: '' },
          items: [
            {
              thumbnail: { imageUrl: '' },
              title: '',
              description: '',
            },
          ],
        },
      ];
      break;

    case CARD_TYPES.BUTTON_CAROUSEL:
      addCard = [
        {
          type: CARD_TYPES.BUTTON_CAROUSEL,
          title: '',
          thumbnail: { imageUrl: '' },
          description: '',
          buttons: [{ id: 1, label: 'Button 01', action: 'block' }],
        },
        {
          buttons: [{ id: 0, label: '+ Add a ChatBubble', action: 'block' }],
        },
      ];
      break;

    case CARD_TYPES.COMMERCE_CAROUSEL:
      addCard = [
        {
          type: CARD_TYPES.COMMERCE_CAROUSEL,
          price: 0,
          currency: 'USD', // 파트너스센터 설정에 따라 코드 변경 필요
          thumbnail: { imageUrl: '' },
          profile: { brandName: '', imageUrl: '' },
          productName: '',
        },
        {
          buttons: [{ id: 0, label: '+ Add a ChatBubble', action: 'block' }],
        },
      ];
      break;

    case CARD_TYPES.LIST_CAROUSEL:
      addCard = [
        {
          type: CARD_TYPES.LIST_CAROUSEL,
          header: {
            title: '',
          },
          thumbnail: { imageUrl: '' },
          items: [
            {
              thumbnail: { imageUrl: '' },
              title: '',
              description: '',
            },
          ],
        },
        {
          buttons: [{ id: 0, label: '+ Add a ChatBubble', action: 'block' }],
        },
      ];
      break;

    case CARD_TYPES.QUICK_REPLY:
      addCard = [
        {
          type: CARD_TYPES.QUICK_REPLY,
          label: '',
          action: 'block',
          blockId: '',
        },
      ];
      break;

    case CARD_TYPES.CONDITION:
      addCard = [
        {
          type: CARD_TYPES.CONDITION,
          title: '',
          greenNode: '',
          redNode: '',
          condition: null,
        },
      ];
      break;

    case CARD_TYPES.COUNT:
      addCard = [
        {
          type: CARD_TYPES.COUNT,
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

  return addCard;
};
