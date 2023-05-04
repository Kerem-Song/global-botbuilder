import { useHttp, useRootState } from '@hooks';
import { IHasResult, IPagingItems } from '@models';
import {
  IDeploy,
  IResponseDeploy,
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
      [DEPLOY_HISTORY_LIST_KEY, pageNo, countPerPage, botId, token],
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
        refetchOnReconnect: true,
        retry: 1,
        enabled: token !== undefined,
      },
    );
  };

  const deployingBotMutate = useMutation(async (data: IDeploy) => {
    const result = await http.post<IDeploy, AxiosResponse<IResponseDeploy>>(
      'Bot/Deploy',
      data,
    );
    if (result) {
      queryClient.invalidateQueries([DEPLOY_HISTORY_LIST_KEY]);
      return result.data;
    }
  });

  const updateDeployHistoryCommentMutate = useMutation(
    async (data: IUpdateDeployHistoryComment) => {
      const result = await http.post<
        IUpdateDeployHistoryComment,
        AxiosResponse<IResponse>
      >('Bot/UpdateDeployHistoryComment', data);
      if (result) {
        queryClient.invalidateQueries([DEPLOY_HISTORY_LIST_KEY]);
        return result.data;
      }
    },
  );

  return {
    getDeployHistoryListQuery,
    isDeployingBotIsLoading: deployingBotMutate.isLoading,
    deployingBotAsync: deployingBotMutate.mutateAsync,
    updateDeployHistoryCommentAsync: updateDeployHistoryCommentMutate.mutateAsync,
  };
};
