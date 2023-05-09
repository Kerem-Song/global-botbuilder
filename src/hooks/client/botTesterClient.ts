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
    const result = await http.post<ISendMessage, AxiosResponse<IBotTester>>(
      'BotTest/Send',
      sendMessage,
    );

    return result.data.result;
  });

  const refreshBotTesterMutate = useMutation(
    async (reFreshBotToken: IRefreshBotTester) => {
      const result = await http.post<
        IRefreshBotTester,
        AxiosResponse<IResponseRefreshBotTester>
      >('BotTest/Refresh', reFreshBotToken);

      return result.data;
    },
  );

  return {
    botTesterMutate,
    refreshBotTesterAsync: refreshBotTesterMutate.mutateAsync,
  };
};
