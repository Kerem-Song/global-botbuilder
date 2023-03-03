import { useHttp, useRootState } from '@hooks';
import {
  IDeleteEntryGroup,
  IGetEntryGroup,
  IHasResult,
  IPagingItems,
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

  const getEntityListQuery = (pageNo: number, keyword?: string, isSys?: boolean) => {
    return http
      .post<
        ISearchEntryGroup,
        AxiosResponse<IHasResult<IPagingItems<IResponseEntryItems>>>
      >('Builder/SearchEntryGroup', {
        sessionToken: token,
        countPerPage: 20,
        isSys: isSys,
        pageNo: pageNo,
        keyword: keyword,
      })
      .then((res) => {
        return res.data.result;
      });
  };

  const changePageNumberQuery = (keyword?: string, isSys?: boolean) => {
    return useInfiniteQuery(
      ['change-pageNumber', keyword, isSys],
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
      },
    );
  };

  const entryGroupMutate = useMutation(async (entry: ISaveEntryGroup) => {
    const result = await http.post<
      ISaveEntryGroup,
      AxiosResponse<IHasResult<IResponseSaveEntryGroup>>
    >('Builder/SaveEntryGroup', entry);

    if (result) {
      queryClient.invalidateQueries(['change-pageNumber']);
      return result.data;
    }
  });

  const entryGroupDeleteMutate = useMutation(async (deleteEntry: IDeleteEntryGroup) => {
    const result = await http.post<
      IDeleteEntryGroup,
      AxiosResponse<IHasResult<IResponseSaveEntryGroup>>
    >('Builder/DeleteEntryGroup', deleteEntry);

    if (result) {
      queryClient.invalidateQueries(['change-pageNumber']);
      return result.data;
    }
  });

  const getEntryDetailQuery = (entryId?: string) => {
    if (entryId) {
      return useQuery<IResponseSaveEntryGroup>(
        ['entry-detail', entryId],
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

  return {
    getEntityListQuery,
    changePageNumberQuery,
    entryGroupMutate,
    entryGroupDeleteMutate,
    getEntryDetailQuery,
  };
};
