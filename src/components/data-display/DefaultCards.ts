import { IBasicCard, ICommerceCard, IListCard } from '@models/interfaces/ICard';
import { TDefaultCard } from '@models/types/DefaultCardType';

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
  }

  return addCard;
};
