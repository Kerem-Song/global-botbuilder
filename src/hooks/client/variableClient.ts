import { useHttp, useRootState } from '@hooks';
import { IException, IHasResults, ISearchParameter } from '@models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  IDeleteParameter,
  IResponseDeleteParameter,
  IResponseSaveParameter,
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

  const variableMutate = useMutation(async (variable: ISaveParameter) => {
    const res = await http.post<
      ISaveParameter,
      AxiosResponse<IResponseSaveParameter<ISaveParameterData>>
    >('Builder/SaveParameter', variable);

    const exception = res.data.exception as IException;

    if (exception) {
      return exception.errorCode;
    }

    if (res.data.isSuccess) {
      queryClient.invalidateQueries(['variable-list', token]);
      queryClient.invalidateQueries(['variable-select-list', token]);
      return res.data;
    }
    return '';
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

  return {
    getVariableListQuery,
    getParameterFormatsQuery,
    variableAsync: variableMutate.mutateAsync,
    variableDeleteAsync: variableDeleteMutate.mutateAsync,
  };
};
