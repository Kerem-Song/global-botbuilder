import { useHttp, useRootState } from '@hooks';
import {
  IJsonCheckApiValidation,
  IJsonRequestView,
} from '@models/interfaces/res/IGetFlowRes';
import axios, { RawAxiosRequestHeaders } from 'axios';

export const useDataApiClient = () => {
  const http = useHttp();
  const token = useRootState((state) => state.botInfoReducer.token);

  const checkApiValidation = async ({
    method,
    url,
    headers,
    body,
    queryStrings,
  }: IJsonCheckApiValidation) => {
    const header = headers.reduce(
      (obj, item) => Object.assign(obj, { [item.key]: item.value }),
      {} as RawAxiosRequestHeaders,
    );

    const queryString = queryStrings?.reduce(
      (obj, item) => Object.assign(obj, { [item.key]: item.value }),
      {},
    );

    const res = await axios({
      method,
      url,
      data: body,
      headers: header,
      params: queryString,
    });
    console.log('@checkApiValidation res?: ', res);
    if (res) {
      console.log('@checkApiValidation res: ', res);
      return res;
    }
  };

  const dataApiTest = async (data: IJsonRequestView) => {
    const res = await http.post('/bottest/dataapitest', {
      sessionToken: token,
      apiData: data,
    });
    if (res) {
      console.log('@checkApiValidation res: ', res);
      return res;
    }
  };

  return {
    checkApiValidation,
    dataApiTest,
  };
};
