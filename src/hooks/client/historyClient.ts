import { useRootState } from '@hooks/useRootState';
import {
  IGetFlowSnapShot,
  IGetFlowSnapShotRes,
  IHasResult,
  IPagingItems,
  THistoryCategoryValues,
} from '@models';
import { IGetHistoryList, IResponseHistoryItem } from '@models';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { useHttp } from '../useHttp';

const HISTORY_LIST_KEY = 'history-list';

export const useHistoryClient = () => {
  const http = useHttp();
  const queryClient = useQueryClient();
  const token = useRootState((state) => state.botInfoReducer.token);

  const getHistoryListQuery = ({
    botId,
    pageNo,
    countPerPage,
    year,
    category,
  }: {
    botId: string;
    pageNo: number;
    countPerPage?: number;
    year?: string;
    category?: THistoryCategoryValues | null;
  }) => {
    return http
      .post<
        IGetHistoryList,
        AxiosResponse<IHasResult<IPagingItems<IResponseHistoryItem>>>
      >('bot/searchhistory', {
        botId: botId,
        pageNo: pageNo,
        countPerPage: 100,
        category: category,
        year: year,
      })
      .then((res) => {
        return res.data.result;
      });
  };

  const invalidateGetHistoryListQuery = (searchData: IGetHistoryList) => {
    queryClient.invalidateQueries([
      HISTORY_LIST_KEY,
      searchData.botId,
      searchData.category,
      searchData.year,
      searchData.pageNo,
    ]);
  };

  const changeHistoryPageNumberQuery = (searchData: IGetHistoryList) => {
    return useInfiniteQuery(
      [HISTORY_LIST_KEY, token, searchData.botId, searchData.category, searchData.year],
      async ({ pageParam = 1 }) => {
        return await getHistoryListQuery({
          ...searchData,
          botId: searchData.botId,
          pageNo: pageParam,
          category: searchData.category || null,
          year: searchData.year,
        });
      },
      {
        getNextPageParam: (lastPage, pages) => {
          if (lastPage.totalPage > 1) {
            const max = Math.ceil(lastPage.total / 100);
            const next = pages.length + 1;
            return next <= max ? next : undefined;
          }
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
        enabled: token !== undefined,
      },
    );
  };

  const getFlowSnapShot = ({ botId, historyId }: IGetFlowSnapShot) => {
    return useQuery<IHasResult<IGetFlowSnapShotRes>>(
      ['flow-snapshot', historyId, botId],
      () =>
        http
          .post<IGetFlowSnapShot, AxiosResponse<IHasResult<IGetFlowSnapShotRes>>>(
            'bot/getflowsnapshot',
            {
              botId: botId,
              historyId: historyId,
            },
          )
          .then((res) => res.data),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  return {
    getHistoryListQuery,
    invalidateGetHistoryListQuery,
    changeHistoryPageNumberQuery,
    getFlowSnapShot,
  };
};
