import {
  IBasicCard,
  ICommerceCard,
  IListCard,
  TDefaultCard,
} from '@models/interfaces/ICard';

export const defaultCards = (cardType: TDefaultCard) => {
  let addCard: IBasicCard[] | ICommerceCard[] | IListCard[] = [];

  switch (cardType) {
    case 'Text':
    case 'Image':
    case 'Button Template':
      addCard = [
        {
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
  }

  return addCard;
};
