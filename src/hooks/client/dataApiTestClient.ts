import { useHttp, useRootState } from '@hooks';
import { IHasResult } from '@models';
import { IDataApiTest, IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const checkDataApiTest = (data: IJsonRequestView) => {
  const http = useHttp();
  const token = useRootState((state) => state.botInfoReducer.token);

  return useQuery(
    ['data-api-test', token],
    async () =>
      await http.post<IDataApiTest, AxiosResponse<IHasResult<string>>>(
        '/bottest/dataapitest',
        {
          sessionToken: token,
          apiData: data,
        },
      ),
    // .then((res) => {
    //   console.log('@res.data', res.data);
    //   return res.data;
    // }),
    { refetchOnWindowFocus: false, refetchOnMount: false, enabled: false },
  );
};
