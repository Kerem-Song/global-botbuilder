import { useHttp, useRootState } from '@hooks';
import { IHasResult, IPagingItems } from '@models';
import {
  IDeploy,
  IException,
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
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: 1,
        enabled: token !== undefined,
      },
    );
  };

  const deployingBotMutate = useMutation(async (data: IDeploy) => {
    const res = await http.post<IDeploy, AxiosResponse<IResponseDeploy>>(
      'Bot/Deploy',
      data,
    );

    const exception = res.data.exception as IException;

    if (exception) {
      queryClient.invalidateQueries([DEPLOY_HISTORY_LIST_KEY]);
      return exception.errorCode;
    }

    if (res.data.isSuccess) {
      queryClient.invalidateQueries([DEPLOY_HISTORY_LIST_KEY]);
    }
    return '';
  });

  const updateDeployHistoryCommentMutate = useMutation(
    async (data: IUpdateDeployHistoryComment) => {
      const res = await http.post<IUpdateDeployHistoryComment, AxiosResponse<IResponse>>(
        'Bot/UpdateDeployHistoryComment',
        data,
      );
      if (res) {
        queryClient.invalidateQueries([DEPLOY_HISTORY_LIST_KEY]);
        return res.data;
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
