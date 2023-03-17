import { useHttp } from '@hooks';
import { IHasResult, IPagingItems } from '@models';
import {
  IResponseSearchDeployHistory,
  ISearchDeployHistory,
} from '@models/interfaces/IDeploy';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const useDeployClient = () => {
  const http = useHttp();
  const DEPLOY_HISTORY_LIST_KEY = 'deploy-history-list';

  const getDeployHistoryListQuery = ({
    pageNo,
    countPerPage,
    botId,
  }: {
    pageNo: number;
    countPerPage: number;
    botId: string;
  }) => {
    return useQuery<IHasResult<IPagingItems<IResponseSearchDeployHistory>>>(
      [DEPLOY_HISTORY_LIST_KEY, pageNo, countPerPage, botId],
      () =>
        http
          .post<
            ISearchDeployHistory,
            AxiosResponse<IHasResult<IPagingItems<IResponseSearchDeployHistory>>>
          >('Bot/SearchDeployHistory', {
            pageNo: pageNo,
            countPerPage: countPerPage,
            botId: botId,
          })
          .then((res) => res.data),
      {
        // staleTime: 2000,
        // keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      },
    );
  };

  return {
    getDeployHistoryListQuery,
  };
};
