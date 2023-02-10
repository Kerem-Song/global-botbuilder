import { useRootState } from '@hooks/useRootState';
import { IHasResult } from '@models/interfaces/IHasResult';
import { IPagingItems } from '@models/interfaces/IPagingItems';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
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
    orderType?: number,
    flowId?: string | null | undefined,
    keyword?: string | undefined,
  ) => {
    return useQuery<IPagingItems<IIntentListItem>>(
      ['intent-list', orderType, flowId, keyword],
      () =>
        http
          .post<ISearchIntent, AxiosResponse<IHasResult<IPagingItems<IIntentListItem>>>>(
            'Builder/SearchIntent',
            {
              sessionToken: token,
              countPerPage: 20,
              orderType,
              flowId,
              keyword,
            },
          )
          .then((res) => res.data.result),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const getPageQuery = async (
    pageNo: number,
    orderType?: number,
    flowId?: string | null | undefined,
    keyword?: string | undefined,
  ) => {
    return await http
      .post<ISearchIntent, AxiosResponse<IHasResult<IPagingItems<IIntentListItem>>>>(
        'Builder/SearchIntent',
        {
          sessionToken: token,
          countPerPage: 20,
          pageNo: pageNo,
          orderType,
          flowId,
          keyword,
        },
      )
      .then((res) => {
        return res.data.result;
      });
  };

  const changePageNumberQuery = useInfiniteQuery(
    ['change-pageNumber'],
    async ({ pageParam = 1 }) => {
      return await getPageQuery(pageParam);
    },
    {
      getNextPageParam: (lastpage, pages) => {
        if (lastpage.totalPage > 1) {
          const max = Math.ceil(lastpage.total / 20);
          const next = pages.length + 1;
          return next <= max ? next : undefined;
        }
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  );

  const getIntentDetailQuery = (intentId?: string) => {
    if (intentId) {
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
    }
    return null;
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
      queryClient.invalidateQueries(['change-pageNumber']);
      return result.data;
    }
  });

  return {
    getIntentListQuery,
    getIntentDetailQuery,
    getPageQuery,
    intentMutate,
    intentDeleteMutate,
    intentGetMutate,
    changePageNumberQuery,
  };
};
