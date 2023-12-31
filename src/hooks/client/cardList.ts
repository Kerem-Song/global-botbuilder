import { useQuery } from '@tanstack/react-query';
import { IBasicCardNode, IProductCardNode } from 'src/models/interfaces/ICard';

import { useHttp } from '../useHttp';

export const useCardList = () => {
  const http = useHttp();

  const getCardListQuery = useQuery<IBasicCardNode[] | IProductCardNode[]>(
    ['card-list'],
    () =>
      http
        .get('https://636c4e007f47ef51e145ed03.mockapi.io/api/card')
        .then((res) => res.data),
  );

  return { getCardListQuery };
};
