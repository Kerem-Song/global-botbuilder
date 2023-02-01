import { useRootState } from '@hooks/useRootState';
import { IHasResult } from '@models/interfaces/IHasResult';
import { IPagingItems } from '@models/interfaces/IPagingItems';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  IDeleteIntent,
  IGetIntent,
  IIntentListItem,
  IResponseIntentData,
  ISaveIntent,
  ISearchIntent,
} from './../../models/interfaces/IUtterance';
import { useHttp } from './../useHttp';

export const useUtteranceClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();
  const token = useRootState((state) => state.botBuilderReducer.token);

  const getIntentListQuery = (
    orderType: number,
    flowId: string | null | undefined,
    keyword: string | undefined,
  ) => {
    return useQuery<IPagingItems<IIntentListItem>>(
      ['intent-list', orderType, flowId, keyword],
      () =>
        http
          .post<ISearchIntent, AxiosResponse<IHasResult<IPagingItems<IIntentListItem>>>>(
            'Builder/SearchIntent',
            {
              sessionToken: token,
              countPerPage: 50,
              orderType,
              flowId,
              keyword,
            },
          )
          .then((res) => res.data.result),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const getIntentDetailQuery = (intentId: string | undefined) => {
    return useQuery<IHasResult<IIntentListItem>>(
      ['intent-detail', intentId],
      () =>
        http
          .post<IGetIntent, AxiosResponse<IHasResult<IIntentListItem>>>(
            'Builder/GetIntent',
            {
              sessionToken: token,
              intentId,
            },
          )
          .then((res) => res.data),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const intentMutate = useMutation(async (intent: ISaveIntent) => {
    const result = await http.post<ISaveIntent, AxiosResponse<IResponseIntentData>>(
      'Builder/SaveIntent',
      intent,
    );
    return result.data;
  });

  const intentGetMutate = useMutation(async (intent: IGetIntent) => {
    const result = await http.post<
      IGetIntent,
      AxiosResponse<IHasResult<IIntentListItem>>
    >('Builder/GetIntent', intent);
    return result.data;
  });

  const intentDeleteMutate = useMutation(async (deleteIntent: IDeleteIntent) => {
    const result = await http.post<IDeleteIntent, AxiosResponse<IResponseIntentData>>(
      'Builder/DeleteIntent',
      deleteIntent,
    );

    if (result) {
      queryClient.invalidateQueries(['intent-list']);
      return result.data;
    }
  });

  return {
    getIntentListQuery,
    getIntentDetailQuery,
    intentMutate,
    intentDeleteMutate,
    intentGetMutate,
  };
};
