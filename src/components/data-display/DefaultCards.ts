import {
  IBasicCard,
  ICommerceCard,
  ICondition,
  ICount,
  IListCard,
  IQuickReply,
  TDefaultCard,
} from '@models/interfaces/ICard';

export const defaultCards = (cardType: TDefaultCard) => {
  let addCard:
    | IBasicCard[]
    | ICommerceCard[]
    | IListCard[]
    | IQuickReply[]
    | ICondition[]
    | ICount[] = [];

  switch (cardType) {
    case 'Text':
    case 'Image':
    case 'Button Template':
      addCard = [
        {
          type:
            cardType === 'Text'
              ? 'Text'
              : cardType === 'Image'
              ? 'Image'
              : 'Button Template',
          title: cardType === 'Image' ? undefined : '',
          thumbnail: cardType === 'Text' ? undefined : { imageUrl: '' },
          description: cardType === 'Image' ? undefined : '',
          buttons:
            cardType === 'Text' || cardType === 'Image'
              ? undefined
              : [{ label: 'Button 01', action: 'block' }],
        },
      ];
      break;

    case 'Commerce':
      addCard = [
        {
          type: 'Commerce',
          price: 0,
          currency: 'USD', // 파트너스센터 설정에 따라 코드 변경 필요
          thumbnail: { imageUrl: '' },
          profile: { brandName: '', imageUrl: '' },
          productName: '',
        },
      ];
      break;

    case 'List':
      addCard = [
        {
          type: 'List',
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

    case 'Button Carousel':
      addCard = [
        {
          type: 'Button Carousel',
          title: '',
          thumbnail: { imageUrl: '' },
          description: '',
          buttons: [{ label: 'Button 01', action: 'block' }],
        },
        {
          buttons: [{ label: '+ Add a ChatBubble', action: 'block' }],
        },
      ];
      break;

    case 'Commerce Carousel':
      addCard = [
        {
          type: 'Commerce Carousel',
          price: 0,
          currency: 'USD', // 파트너스센터 설정에 따라 코드 변경 필요
          thumbnail: { imageUrl: '' },
          profile: { brandName: '', imageUrl: '' },
          productName: '',
        },
        {
          buttons: [{ label: '+ Add a ChatBubble', action: 'block' }],
        },
      ];
      break;

    case 'List Carousel':
      addCard = [
        {
          type: 'List Carousel',
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
          buttons: [{ label: '+ Add a ChatBubble', action: 'block' }],
        },
      ];
      break;

    case 'Quick Reply':
      addCard = [
        {
          type: 'Quick Reply',
          label: '',
          action: 'block',
          blockId: '',
        },
      ];
      break;

    case 'Condition':
      addCard = [
        {
          type: 'Condition',
          title: '',
          greenNode: '',
          redNode: '',
          condition: null,
        },
      ];
      break;

    case 'Count':
      addCard = [
        {
          type: 'Count',
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
