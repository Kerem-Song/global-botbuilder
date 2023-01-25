import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  ISaveIntent,
  ISearchIntent,
  IUtteranceDetailList,
  IUtteranceList,
} from './../../models/interfaces/IUtterance';
import { useHttp } from './../useHttp';
export const useUtteranceClient = () => {
  const http = useHttp();

  const utteranceListItemMutate = useMutation(
    async (utteranceListItem: ISearchIntent) => {
      const result = await http.post<ISearchIntent, AxiosResponse<IUtteranceList>>(
        'builder/searchIntent',
        utteranceListItem,
      );

      return result.data;
    },
  );

  const utteranceDetailMutate = useMutation(async (utteranceDetail: ISaveIntent) => {
    const result = await http.post<ISaveIntent, AxiosResponse<IUtteranceDetailList>>(
      'Builder/SaveIntent',
      utteranceDetail,
    );
    return result.data;
  });

  return { utteranceListItemMutate, utteranceDetailMutate };
};
