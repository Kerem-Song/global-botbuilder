import { useRootState } from '@hooks/useRootState';
import { IGetBotReq, IHasResult, IHasResults, ISearchBotReq } from '@models';
import { setBotInfo } from '@store/botInfoSlice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { IBotInput, IBotModel } from 'src/models/interfaces/IBotModel';

import useHttp from '../useHttp';

export const useBotClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();
  const dispatch = useDispatch();

  const brandId = useRootState((state) => state.brandInfoReducer.brandId);

  const getBotListQuery = () => {
    return useQuery<IBotModel[]>(
      ['bot-list'],
      () =>
        http
          .post<ISearchBotReq, AxiosResponse<IHasResults<IBotModel>>>('/bot/searchbot', {
            brandId: brandId,
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
          .then((res) => {
            dispatch(setBotInfo(res.data.result));
            return res.data.result;
          }),
      { refetchOnWindowFocus: false, refetchOnMount: false },
    );
  };

  const refetchBotInfo = (botId: string) => {
    queryClient.invalidateQueries(['bot-info', botId]);
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
    refetchBotInfo,
    botSaveAsync: botSaveMutate.mutateAsync,
  };
};
