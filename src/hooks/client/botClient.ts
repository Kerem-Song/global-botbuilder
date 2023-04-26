import { useRootState } from '@hooks/useRootState';
import {
  IGetBotReq,
  IHasResult,
  IHasResults,
  IResponse,
  ISaveBotReq,
  ISearchBotReq,
} from '@models';
import {
  IImportFlowGroup,
  IUpdateBotActivate,
  IUpdateChannelActivate,
} from '@models/interfaces/IBotSetting';
import { setBotInfo } from '@store/botInfoSlice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { saveAs } from 'file-saver';
import { useDispatch } from 'react-redux';

import { IBotInput, IBotModel } from '../../models/interfaces/IBotModel';
import useHttp from '../useHttp';

export const useBotClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();
  const dispatch = useDispatch();

  const brandId = useRootState((state) => state.brandInfoReducer.brandId);

  const getBotListQuery = () => {
    return useQuery<IBotModel[]>(
      ['bot-list'],
      () =>
        http
          .post<ISearchBotReq, AxiosResponse<IHasResults<IBotModel>>>('/bot/searchbot', {
            brandId: brandId,
          })
          .then((res) => res.data.result),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const getCachedBotList = (): IBotModel[] | undefined => {
    return queryClient.getQueryData<IBotModel[]>(['bot-list']);
  };

  const getBotInfoQuery = (botId: string) => {
    return useQuery<IBotModel>(
      ['bot-info', botId],
      () =>
        http
          .post<IGetBotReq, AxiosResponse<IHasResult<IBotModel>>>('/bot/getbotinfo', {
            botId,
          })
          .then((res) => {
            dispatch(setBotInfo(res.data.result));
            return res.data.result;
          }),
      { refetchOnWindowFocus: false, refetchOnMount: false },
    );
  };

  const refetchBotInfo = (botId: string) => {
    queryClient.invalidateQueries(['bot-info', botId]);
  };

  const botSaveMutate = useMutation(async (botInput: IBotInput) => {
    const res = await http.post<IBotInput, AxiosResponse<IResponse>>(
      '/bot/createbot',
      botInput,
    );

    if (res) {
      if (res.data.isSuccess) {
        queryClient.invalidateQueries(['bot-list']);
      }
      return res;
    }
  });

  const botExportMutate = useMutation(
    async (args: { botId: string; botName: string }) => {
      const res = await http.post('/bot/exportcurrentflowgroup', args, {
        responseType: 'blob',
      });

      if (res) {
        const blob = new Blob([res.data]);
        saveAs(blob, `Lunatalk_${args.botName}_${args.botId}.json`);
        return true;
      }
    },
  );

  const botDeleteMutate = useMutation(async (args: { botId: string }) => {
    const res = await http.post('/bot/deletebot', args);

    if (res) {
      queryClient.invalidateQueries(['bot-info', args.botId]);
      return res;
    }
  });

  const botRecoverMutate = useMutation(async (args: { botId: string }) => {
    const res = await http.post('/bot/recoverbot', args);

    if (res) {
      queryClient.invalidateQueries(['bot-info', args.botId]);
      return res;
    }
  });

  const botUpdateMutate = useMutation(async (args: ISaveBotReq) => {
    const res = await http.post('/bot/updatebot', args);
    if (res) {
      queryClient.invalidateQueries(['bot-info', args.botId]);
      return res;
    }
  });

  const botActivateMutate = useMutation(async (args: IUpdateBotActivate) => {
    const res = await http.post('/bot/updatebotactivate', args);
    if (res) {
      queryClient.invalidateQueries(['bot-info', args.botId]);
      return res;
    }
  });

  const botChannelActivateMutate = useMutation(async (args: IUpdateChannelActivate) => {
    const res = await http.post('/bot/updatechannelactivate', args);
    if (res) {
      queryClient.invalidateQueries(['bot-info', args.botId]);
      return res;
    }
  });

  const botImportFlowGroupMutate = useMutation(async (args: IImportFlowGroup) => {
    const formData = new FormData();
    formData.append('file', args.file);
    formData.append('botId', args.botId);
    const res = await http.post('/Bot/ImportFlowGroup', formData);
    if (res) {
      queryClient.invalidateQueries(['bot-info', args.botId]);
      return res;
    }
  });

  return {
    getBotListQuery,
    getCachedBotList,
    getBotInfoQuery,
    refetchBotInfo,
    botExportAsync: botExportMutate.mutateAsync,
    botSaveAsync: botSaveMutate.mutateAsync,
    botDeleteAsync: botDeleteMutate.mutateAsync,
    botRecoverAsync: botRecoverMutate.mutateAsync,
    botUpdateAsync: botUpdateMutate.mutateAsync,
    botActivateAsync: botActivateMutate.mutateAsync,
    botChannelActivateAsync: botChannelActivateMutate.mutateAsync,
    botImportAsync: botImportFlowGroupMutate.mutateAsync,
  };
};
