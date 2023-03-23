import { useRootState } from '@hooks/useRootState';
import {
  IHasResult,
  IHistoryListRes,
  IPagingItems,
  ISearchHistoryData,
  THistoryCategoryValues,
} from '@models';
import { IGetHistoryList, IResponseHistoryItem } from '@models';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
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
    category?: THistoryCategoryValues;
  }) => {
    return http
      .post<IGetHistoryList, AxiosResponse<IHasResult<IPagingItems<IHistoryListRes>>>>(
        'bot/searchhistory',
        {
          botId: botId,
          pageNo: pageNo,
          countPerPage: 100,
          category: category,
          year: year,
        },
      )
      .then((res) => {
        return res.data.result;
      });
  };

  const invalidateGetHistoryListQuery = (searchData: ISearchHistoryData) => {
    queryClient.invalidateQueries([
      HISTORY_LIST_KEY,
      searchData.botId,
      searchData.category,
      searchData.year,
    ]);
  };

  const changeHistoryPageNumberQuery = (searchData: ISearchHistoryData) => {
    return useInfiniteQuery(
      [HISTORY_LIST_KEY, token, searchData.botId, searchData.category, searchData.year],
      async ({ pageParam = 1 }) => {
        return await getHistoryListQuery({
          pageNo: pageParam,
          countPerPage: 100,
          ...searchData,
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

  return {
    getHistoryListQuery,
    invalidateGetHistoryListQuery,
    changeHistoryPageNumberQuery,
  };
};
