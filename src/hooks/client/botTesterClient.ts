import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { IBotTester } from './../../models/interfaces/IBotTester';
import { useHttp } from './../useHttp';

export const useBotTesterClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();

  const getMessageItems = useQuery<IBotTester>(['botTester-productCard'], () =>
    http
      .get('https://638319836e6c83b7a98bcb28.mockapi.io/api/bot-tester/message_items')
      .then((res) => res.data),
  );

  const botTesterMutate = useMutation(async (botTester: IBotTester) => {
    const res = await http.post(
      'https://638319836e6c83b7a98bcb28.mockapi.io/api/bot-tester/message_items',
      botTester,
    );

    if (res) {
      queryClient.invalidateQueries(['botTester-productCard']);
      return res;
    }
  });

  return { data: getMessageItems.data, botTesterMutate };
};
