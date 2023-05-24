import { useHttp, useRootState } from '@hooks';
import {
  IDeleteEntryGroup,
  IGetEntryGroup,
  IHasResult,
  IPagingItems,
  IResponseEntity,
  IResponseEntryItems,
  IResponseSaveEntryGroup,
  ISaveEntryGroup,
  ISearchEntryGroup,
} from '@models';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const useEntityClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();
  const token = useRootState((state) => state.botInfoReducer.token);

  const getEntityListQuery = async (
    pageNo: number,
    keyword?: string,
    isSys?: boolean,
  ) => {
    return await http
      .post<
        ISearchEntryGroup,
        AxiosResponse<IHasResult<IPagingItems<IResponseEntryItems>>>
      >('Builder/SearchEntryGroup', {
        sessionToken: token,
        countPerPage: 20,
        pageNo: pageNo,
        keyword: keyword,
        isSys: isSys,
      })
      .then((res) => {
        return res.data.result;
      });
  };

  const changePageNumberQuery = (keyword?: string, isSys?: boolean) => {
    return useInfiniteQuery(
      ['change-pageNumber', token, keyword, isSys],
      async ({ pageParam = 1 }) => {
        return await getEntityListQuery(pageParam, keyword, isSys);
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
        enabled: token !== undefined,
      },
    );
  };

  const removeEntityQueries = () => {
    queryClient.removeQueries(['change-pageNumber']);
  };

  const getEntryDetailQuery = (entryId?: string) => {
    if (entryId) {
      return useQuery<IResponseSaveEntryGroup>(
        ['entry-detail', token, entryId],
        () =>
          http
            .post<IGetEntryGroup, AxiosResponse<IHasResult<IResponseSaveEntryGroup>>>(
              'Builder/GetEntryGroup',
              {
                sessionToken: token,
                entryGroupId: entryId,
                isSys: false,
              },
            )
            .then((res) => res.data.result),
        { refetchOnWindowFocus: false, refetchOnMount: true },
      );
    }
    return null;
  };

  const entryGroupMutate = useMutation(async (entry: ISaveEntryGroup) => {
    const result = await http.post<
      ISaveEntryGroup,
      AxiosResponse<IResponseEntity<IResponseSaveEntryGroup>>
    >('Builder/SaveEntryGroup', entry);

    if (result) {
      console.log('result', result);
      removeEntityQueries();
      return result.data;
    }
  });

  const entryGroupDeleteMutate = useMutation(async (deleteEntry: IDeleteEntryGroup) => {
    const result = await http.post<
      IDeleteEntryGroup,
      AxiosResponse<IHasResult<IResponseSaveEntryGroup>>
    >('Builder/DeleteEntryGroup', deleteEntry);

    if (result) {
      removeEntityQueries();
      return result.data;
    }
  });

  return {
    getEntityListQuery,
    changePageNumberQuery,
    entryGroupAsync: entryGroupMutate.mutateAsync,
    entryGroupDeleteAsync: entryGroupDeleteMutate.mutateAsync,
    getEntryDetailQuery,
    removeEntityQueries,
  };
};
