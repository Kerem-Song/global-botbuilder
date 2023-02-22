import { useHttp, useRootState } from '@hooks';
import { IHasResults, ISearchParameter } from '@models';
import { IVariable } from '@models/interfaces/IVariable';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const useVariableSelectClient = () => {
  const http = useHttp();
  const token = useRootState((state) => state.botInfoReducer.token);

  const getVariableSelectListQuery = useQuery<IVariable[]>(
    ['variable-select-list', token],
    () =>
      http
        .post<ISearchParameter, AxiosResponse<IHasResults<IVariable>>>(
          'Builder/GetVariable',
          {
            sessionToken: token,
          },
        )
        .then((res) => res.data.result),
    { refetchOnWindowFocus: false, refetchOnMount: false },
  );

  return {
    getVariableSelectListQuery,
  };
};
