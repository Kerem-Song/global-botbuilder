import { useQuery } from '@tanstack/react-query';
import { IBotModel } from 'src/models/interfaces/IBotModel';

import useHttp from '../useHttp';

export const useBotClient = () => {
  const http = useHttp();

  const getBotListQuery = useQuery<IBotModel[]>(['bot-list'], () =>
    http
      .get('https://634d41c1f5d2cc648ea0bf80.mockapi.io/bot-list')
      .then((res) => res.data),
  );

  return { getBotListQuery };
};
