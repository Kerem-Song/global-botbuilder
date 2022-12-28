import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IBotModel } from 'src/models/interfaces/IBotModel';

import useHttp from '../useHttp';

export const useBotClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();

  const getBotListQuery = useQuery<IBotModel[]>(
    ['bot-list'],
    () =>
      http
        .get('https://634d41c1f5d2cc648ea0bf80.mockapi.io/bot-list')
        .then((res) => res.data),
    { refetchOnWindowFocus: false, refetchOnMount: true },
  );

  const botSaveMutate = useMutation(async (botModel: IBotModel) => {
    const res = await http.post(
      'https://634d41c1f5d2cc648ea0bf80.mockapi.io/bot-list',
      botModel,
    );

    if (res) {
      queryClient.invalidateQueries(['bot-list']);
      return res;
    }
  });

  return {
    data: getBotListQuery.data,
    isFetching: getBotListQuery.isFetching,
    botSaveAsync: botSaveMutate.mutateAsync,
  };
};
