import { IHasResult } from '@models';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  IBotTester,
  IRefreshBotTester,
  IResponseRefreshBotTester,
  ISendMessage,
} from './../../models/interfaces/IBotTester';
import { useHttp } from './../useHttp';

export const useBotTesterClient = () => {
  const http = useHttp();
  const botTesterMutate = useMutation(async (sendMessage: ISendMessage) => {
    const res = await http.post<ISendMessage, AxiosResponse<IHasResult<IBotTester>>>(
      'BotTest/Send',
      sendMessage,
    );

    return res.data;
  });

  const refreshBotTesterMutate = useMutation(
    async (reFreshBotToken: IRefreshBotTester) => {
      const res = await http.post<
        IRefreshBotTester,
        AxiosResponse<IResponseRefreshBotTester>
      >('BotTest/Refresh', reFreshBotToken);

      return res.data;
    },
  );

  return {
    botTesterMutateAsync: botTesterMutate.mutateAsync,
    refreshBotTesterAsync: refreshBotTesterMutate.mutateAsync,
  };
};
