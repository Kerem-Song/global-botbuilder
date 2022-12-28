import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { IBotTester } from './../../models/interfaces/IBotTester';
import { useHttp } from './../useHttp';

export const useBotTesterClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();

  const getMessageItems = useQuery<IBotTester>(['botTester-productCard'], () =>
    http
      .get('https://634d41c1f5d2cc648ea0bf80.mockapi.io/message-items')
      .then((res) => res.data),
  );

  const botTesterMutate = useMutation(async (botTester: IBotTester) => {
    const res = await http.post(
      'https://634d41c1f5d2cc648ea0bf80.mockapi.io/message-items',
      botTester,
    );
  });

  return { data: getMessageItems.data, botTesterMutate };
};
