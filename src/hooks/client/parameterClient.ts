import { useHttp, useRootState } from '@hooks';
import { IException, IHasResults, ISearchParameter } from '@models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  IDeleteParameter,
  IParameterList,
  IResponseDeleteParameter,
  IResponseSaveParameter,
  ISaveParameter,
  ISaveParameterData,
} from '../../models/interfaces/IParameter';
import { IGetParameterFormats } from './../../models/interfaces/IParameter';

export const useParameterClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();
  const token = useRootState((state) => state.botInfoReducer.token);

  const getParameterListQuery = () => {
    return useQuery<IHasResults<IParameterList>>(
      ['parameter-list', token],
      () =>
        http
          .post<ISearchParameter, AxiosResponse<IHasResults<IParameterList>>>(
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

  const parameterMutate = useMutation(async (parameter: ISaveParameter) => {
    const res = await http.post<
      ISaveParameter,
      AxiosResponse<IResponseSaveParameter<ISaveParameterData>>
    >('Builder/SaveParameter', parameter);

    const exception = res.data.exception as IException;

    if (exception) {
      return exception.errorCode;
    }

    if (res.data.isSuccess) {
      queryClient.invalidateQueries(['parameter-list', token]);
      queryClient.invalidateQueries(['parameter-select-list', token]);
      return res.data;
    }
    return '';
  });

  const parameterDeleteMutate = useMutation(async (deleteParameter: IDeleteParameter) => {
    const result = await http.post<
      IDeleteParameter,
      AxiosResponse<IResponseDeleteParameter>
    >('Builder/DeleteParameter', deleteParameter);

    if (result) {
      queryClient.invalidateQueries(['parameter-list', token]);
      queryClient.invalidateQueries(['parameter-select-list', token]);
      return result.data;
    }
  });

  return {
    getParameterListQuery,
    getParameterFormatsQuery,
    parameterAsync: parameterMutate.mutateAsync,
    parameterDeleteAsync: parameterDeleteMutate.mutateAsync,
  };
};
