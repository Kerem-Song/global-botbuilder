import { IHasResults, ISearchBotReq } from '@models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IBotInput, IBotModel } from 'src/models/interfaces/IBotModel';

import useHttp from '../useHttp';

export const useBotClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();

  const getBotListQuery = useQuery<IBotModel[]>(
    ['bot-list'],
    () =>
      http
        .post<ISearchBotReq, AxiosResponse<IHasResults<IBotModel>>>('/bot/searchbot', {
          brandId: 'lunasoft',
        })
        .then((res) => res.data.result),
    { refetchOnWindowFocus: false, refetchOnMount: true },
  );

  const botSaveMutate = useMutation(async (botInput: IBotInput) => {
    const res = await http.post('/bot/createbot', botInput);

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
