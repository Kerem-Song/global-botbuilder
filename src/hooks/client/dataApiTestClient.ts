import { useHttp, useRootState } from '@hooks';
import { IDataApiTest, IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import { useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

export const dataApiTestClient = () => {
  const checkDataApiTest = (data: IJsonRequestView) => {
    const http = useHttp();
    const token = useRootState((state) => state.botInfoReducer.token);

    return useQuery<IDataApiTest, AxiosError>(
      ['data-api-test', token],
      () =>
        http
          .post<IDataApiTest, AxiosResponse>('/bottest/dataapitest', {
            sessionToken: token,
            apiData: data,
          })
          .then((res) => {
            return res.data;
          }),
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: false,
        retry: false,
      },
    );
  };
  return { checkDataApiTest };
};
