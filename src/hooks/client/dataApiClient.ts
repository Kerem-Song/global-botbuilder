import { IJsonCheckApiValidation } from '@models/interfaces/res/IGetFlowRes';
import axios, { RawAxiosRequestHeaders } from 'axios';
import { createSearchParams } from 'react-router-dom';

const API_VALIDATION = 'api-validation';

export const useDataApiClient = () => {
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

  return {
    checkApiValidation,
  };
};
