import { useHttp, useRootState } from '@hooks';
import { IHasResult, IPagingItems } from '@models';
import {
  IDeploy,
  IResponseSearchDeployHistory,
  ISearchDeployHistory,
  IUpdateDeployHistoryComment,
} from '@models/interfaces/IDeploy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { IResponse } from './../../models/interfaces/IResponse';

export const useDeployClient = () => {
  const http = useHttp();
  const queryClient = useQueryClient();
  const token = useRootState((state) => state.botInfoReducer.token);

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

  const updateDeployHistoryComment = useMutation(
    async (data: IUpdateDeployHistoryComment) => {
      const result = await http.post<
        IUpdateDeployHistoryComment,
        AxiosResponse<IResponse>
      >('Bot/UpdateDeployHistoryComment', data);
      if (result) {
        queryClient.invalidateQueries([DEPLOY_HISTORY_LIST_KEY, token]);
        return result.data;
      }
    },
  );

  const deployingBot = useMutation(async (data: IDeploy) => {
    const result = await http.post<IDeploy, AxiosResponse<IResponse>>('Bot/Deploy', data);
    if (result) {
      queryClient.invalidateQueries([DEPLOY_HISTORY_LIST_KEY, token]);
      return result.data;
    }
  });

  return {
    getDeployHistoryListQuery,
    updateDeployHistoryComment,
    deployingBot,
  };
};
