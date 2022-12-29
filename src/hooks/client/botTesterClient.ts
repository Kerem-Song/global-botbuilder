import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { IBotTester, ISendMessage } from './../../models/interfaces/IBotTester';
import { useHttp } from './../useHttp';

export const useBotTesterClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();

  const getMessageItems = useQuery<IBotTester>(['botTester-productCard'], async () => {
    const result = await http.get(
      'https://634d41c1f5d2cc648ea0bf80.mockapi.io/message-items',
    );

    return result.data;
  });

  const botTesterMutate = useMutation(async (sendMessage: ISendMessage) => {
    const result = await http.post<ISendMessage, AxiosResponse<IBotTester>>(
      'https://634d41c1f5d2cc648ea0bf80.mockapi.io/message-items',
      sendMessage,
    );

    return result.data;
  });

  return { data: getMessageItems.data, botTesterMutate };
};
