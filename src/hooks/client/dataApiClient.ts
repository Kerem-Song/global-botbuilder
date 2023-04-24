import {
  IJsonCheckApiValidation,
  IJsonRequestView,
} from '@models/interfaces/res/IGetFlowRes';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { RawAxiosRequestHeaders } from 'axios';

const API_VALIDATION = 'api-validation';

export const useDataApiClient = () => {
  // const useGetApiValidation = ({
  //   url,
  //   headers,
  //   body,
  //   queryStrings,
  // }: IJsonRequestView) => {
  //   return useQuery({
  //     queryKey: [API_VALIDATION, url, body, queryStrings],
  //     queryFn: async () => {
  //       const res = await axios.get(url, {
  //         params: body,
  //       });

  //       if (res) {
  //         return res;
  //       }
  //     },
  //     onSuccess: (res) => {
  //       console.log('@Res', res);
  //       return res;
  //     },
  //     onError: (e) => {
  //       console.log('@res err', e);
  //     },
  //     meta: { headers: headers },
  //   });
  // };

  // const usePostApiValidation = useMutation(
  //   async ({ url, param }: { url: string; param: any }) => {
  //     const res = await axios.post(url, {
  //       param,
  //     });

  //     if (res) {
  //       return res;
  //     }
  //   },
  // );

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
    // useGetApiValidation,
    // usePostApiValidation,
  };
};
