import { useHttp, useRootState } from '@hooks';
import { IHasResults, ISearchParameter } from '@models';
import { IHasResult } from '@models/interfaces/IHasResult';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  IDeleteParameter,
  IResponseDeleteParameter,
  ISaveParameter,
  ISaveParameterData,
  IVariableList,
} from '../../models/interfaces/IParameter';
import { IGetParameterFormats } from './../../models/interfaces/IParameter';

export const useVariableClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();
  const token = useRootState((state) => state.botInfoReducer.token);

  const getVariableListQuery = () => {
    return useQuery<IHasResults<IVariableList>>(
      ['variable-list', token],
      () =>
        http
          .post<ISearchParameter, AxiosResponse<IHasResults<IVariableList>>>(
            'Builder/SearchParameter',
            {
              sessionToken: token,
            },
          )
          .then((res) => res.data),
      { refetchOnWindowFocus: false, refetchOnMount: true, enabled: token !== undefined },
    );
  };

  const variableMutate = useMutation(async (variable: ISaveParameter) => {
    const result = await http.post<
      ISaveParameter,
      AxiosResponse<IHasResult<ISaveParameterData>>
    >('Builder/SaveParameter', variable);

    if (result) {
      queryClient.invalidateQueries(['variable-list', token]);
      queryClient.invalidateQueries(['variable-select-list', token]);
      return result.data;
    }
  });

  const variableDeleteMutate = useMutation(async (deleteVariable: IDeleteParameter) => {
    const result = await http.post<
      IDeleteParameter,
      AxiosResponse<IResponseDeleteParameter>
    >('Builder/DeleteParameter', deleteVariable);

    if (result) {
      queryClient.invalidateQueries(['variable-list', token]);
      queryClient.invalidateQueries(['variable-select-list', token]);
      return result.data;
    }
  });

  const getParameterFormatsQuery = () => {
    return useQuery<IHasResults<IGetParameterFormats>>(
      ['formats', token],
      () =>
        http
          .post<ISearchParameter, AxiosResponse<IHasResults<IGetParameterFormats>>>(
            'Builder/GetParameterFormats',
            {
              sessionToken: token,
            },
          )
          .then((res) => res.data),
      { refetchOnWindowFocus: false, refetchOnMount: true, enabled: token !== undefined },
    );
  };

  return {
    getVariableListQuery,
    variableMutate,
    variableDeleteMutate,
    getParameterFormatsQuery,
  };
};
