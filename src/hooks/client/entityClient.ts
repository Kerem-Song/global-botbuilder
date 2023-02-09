import { useHttp, useRootState } from '@hooks';
import { IHasResult, IPagingItems } from '@models';
import { IResponseEntryItems, ISearchEntryGroup } from '@models/interfaces/IEntity';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const useEntityClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();
  const token = useRootState((state) => state.botBuilderReducer.token);

  const getEntityListQuery = async (pageNo: number) => {
    return await http
      .post<
        ISearchEntryGroup,
        AxiosResponse<IHasResult<IPagingItems<IResponseEntryItems>>>
      >('Builder/SearchEntryGroup', {
        sessionToken: token,
        countPerPage: 20,
        pageNo: pageNo,
      })
      .then((res) => {
        return res.data.result;
      });
  };

  const changePageNumberQuery = useInfiniteQuery(
    ['change-pageNumber'],
    async ({ pageParam = 1 }) => {
      return await getEntityListQuery(pageParam);
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

  return {
    getEntityListQuery,
    changePageNumberQuery,
  };
};
