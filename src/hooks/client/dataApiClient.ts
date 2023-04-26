import {
  IJsonCheckApiValidation,
  IJsonRequestView,
} from '@models/interfaces/res/IGetFlowRes';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { RawAxiosRequestHeaders } from 'axios';

const API_VALIDATION = 'api-validation';

export const useDataApiClient = () => {
  const checkApiValidation = async ({
    method,
    url,
    headers,
    body,
  }: IJsonCheckApiValidation) => {
    const header = headers.reduce(
      (obj, item) => Object.assign(obj, { [item.key]: item.value }),
      {} as RawAxiosRequestHeaders,
    );

    const res = await axios({ method, url, data: body, headers: header });
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
