import { IGetBotReq, IHasResult, IHasResults, ISearchBotReq } from '@models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IBotInput, IBotModel } from 'src/models/interfaces/IBotModel';

import useHttp from '../useHttp';

export const useBotClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();

  const getBotListQuery = () => {
    return useQuery<IBotModel[]>(
      ['bot-list'],
      () =>
        http
          .post<ISearchBotReq, AxiosResponse<IHasResults<IBotModel>>>('/bot/searchbot', {
            brandId: 'lunasoft',
          })
          .then((res) => res.data.result),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const getCachedBotList = (): IBotModel[] | undefined => {
    return queryClient.getQueryData<IBotModel[]>(['bot-list']);
  };

  const getBotInfoQuery = (botId: string) => {
    return useQuery<IBotModel>(
      ['bot-info', botId],
      () =>
        http
          .post<IGetBotReq, AxiosResponse<IHasResult<IBotModel>>>('/bot/getbotinfo', {
            botId,
          })
          .then((res) => res.data.result),
      { refetchOnWindowFocus: false, refetchOnMount: false },
    );
  };

  const botSaveMutate = useMutation(async (botInput: IBotInput) => {
    const res = await http.post('/bot/createbot', botInput);

    if (res) {
      queryClient.invalidateQueries(['bot-list']);
      return res;
    }
  });

  return {
    getBotListQuery,
    getCachedBotList,
    getBotInfoQuery,
    botSaveAsync: botSaveMutate.mutateAsync,
  };
};
