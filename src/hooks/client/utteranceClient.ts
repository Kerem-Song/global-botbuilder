import { useRootState } from '@hooks/useRootState';
import { IException } from '@models';
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
  ICheckDuplicateIntent,
  ICheckUtterance,
  IDeleteIntent,
  IGetIntent,
  IIntentListItem,
  IResponseCheckDuplication,
  IResponseCheckUtteranceDuplication,
  IResponseIntentData,
  ISaveIntent,
  ISearchData,
  ISearchIntent,
} from './../../models/interfaces/IUtterance';
import { useHttp } from './../useHttp';

const UTTERNACE_LIST_KEY = 'utterance-list';

export const useUtteranceClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();
  const token = useRootState((state) => state.botInfoReducer.token);

  const getPageQuery = async ({
    pageNo,
    sort,
    scenarios,
    searchWord,
  }: {
    pageNo: number;
    sort: number;
    scenarios?: string;
    searchWord?: string;
  }) => {
    return await http
      .post<ISearchIntent, AxiosResponse<IHasResult<IPagingItems<IIntentListItem>>>>(
        'Builder/SearchIntent',
        {
          sessionToken: token,
          countPerPage: 50,
          pageNo: pageNo,
          orderType: sort,
          flowId: scenarios,
          keyword: searchWord,
        },
      )
      .then((res) => {
        return res.data.result;
      });
  };

  const invalidateIntentQuery = (searchData: ISearchData) => {
    queryClient.invalidateQueries([
      UTTERNACE_LIST_KEY,
      token,
      searchData.sort,
      searchData.scenarios,
      searchData.searchWord,
    ]);
  };

  const changePageNumberQuery = (searchData: ISearchData) => {
    return useInfiniteQuery(
      [
        UTTERNACE_LIST_KEY,
        token,
        searchData.sort,
        searchData.scenarios,
        searchData.searchWord,
      ],
      async ({ pageParam = 1 }) => {
        return await getPageQuery({ ...searchData, pageNo: pageParam });
      },
      {
        getNextPageParam: (lastpage, pages) => {
          if (lastpage.totalPage > 1) {
            const max = Math.ceil(lastpage.total / 50);
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

  const removeUtteranceQueries = () => {
    queryClient.removeQueries([UTTERNACE_LIST_KEY]);
  };

  const getIntentDetailQuery = (intentId?: string) => {
    return useQuery<IHasResult<IIntentListItem>>(
      ['intent-detail', token, intentId],
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
      {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        enabled: token !== undefined && intentId !== undefined,
      },
    );
  };

  const intentSaveMutate = useMutation(async (intent: ISaveIntent) => {
    const res = await http.post<ISaveIntent, AxiosResponse<IResponseCheckDuplication>>(
      'Builder/SaveIntent',
      intent,
    );

    const exception = res.data.exception as IException;

    if (exception) {
      return exception.errorCode;
    }

    if (res.data.isSuccess) {
      queryClient.removeQueries([UTTERNACE_LIST_KEY]);
      return res.data.result;
    }
    return;
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
      queryClient.removeQueries([UTTERNACE_LIST_KEY]);
      return result.data;
    }
  });

  const checkIntentDuplicationMutate = useMutation(
    async (criteria: Pick<ICheckDuplicateIntent, 'intentId' | 'name'>) => {
      const result = await http.post<
        ICheckDuplicateIntent,
        AxiosResponse<IResponseCheckDuplication>
      >('Builder/CheckDuplicateIntent', {
        sessionToken: token,
        ...criteria,
      });

      return result.data;
    },
  );

  const checkUtteranceDuplicationMutate = useMutation(
    async (
      criteria: Pick<ICheckUtterance, 'utteranceId' | 'text' | 'customErrorCode'>,
    ) => {
      const res = await http.post<
        ICheckUtterance,
        AxiosResponse<IResponseCheckUtteranceDuplication>
      >('Builder/CheckUtterance', {
        sessionToken: token,
        ...criteria,
      });

      const exception = res.data.exception as IException;

      if (exception) {
        return exception.errorCode;
      }

      if (res.data.isSuccess) {
        return res.data.result;
      }
    },
  );

  return {
    getPageQuery,
    invalidateIntentQuery,
    changePageNumberQuery,
    removeUtteranceQueries,
    getIntentDetailQuery,
    intentSaveAsync: intentSaveMutate.mutateAsync,
    intentDeleteAsync: intentDeleteMutate.mutateAsync,
    intentGetAsync: intentGetMutate.mutateAsync,
    checkIntentDuplicationAsync: checkIntentDuplicationMutate.mutateAsync,
    checkUtteranceDuplicationAsync: checkUtteranceDuplicationMutate.mutateAsync,
  };
};
