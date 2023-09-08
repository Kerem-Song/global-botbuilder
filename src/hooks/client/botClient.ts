import { useRootState } from '@hooks/useRootState';
import {
  IException,
  IGetBotReq,
  IHasResult,
  IHasResults,
  IResponse,
  ISaveBotReq,
  ISearchBotReq,
} from '@models';
import {
  IBotSetting,
  IImportFlowGroup,
  IResponseUpdateBotIcon,
  IUpdateBotActivate,
  IUpdateBotIcon,
  IUpdateChannelActivate,
} from '@models/interfaces/IBotSetting';
import { ICreateBotReq } from '@models/interfaces/req/ICreateBotReq';
import { setBotInfo } from '@store/botInfoSlice';
import { setBotSettingInfo } from '@store/botSettingInfoSlice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { saveAs } from 'file-saver';
import { useDispatch } from 'react-redux';

import { IBotModel, IBotSettingModel } from '../../models/interfaces/IBotModel';
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
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const getBotSettingInfoQuery = (botId: string) => {
    return useQuery<IBotSettingModel>(
      ['bot-setting-info', botId],
      () =>
        http
          .post<IGetBotReq, AxiosResponse<IHasResult<IBotSettingModel>>>(
            '/bot/getbotsettingInfo',
            {
              botId,
            },
          )
          .then((res) => {
            dispatch(setBotSettingInfo(res.data.result));
            return res.data.result;
          }),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const refetchBotInfo = (botId: string) => {
    queryClient.invalidateQueries(['bot-info', botId]);
  };

  const refetchBotSettingInfo = (botId: string) => {
    queryClient.invalidateQueries(['bot-setting-info', botId]);
  };

  const botSaveMutate = useMutation(async (botInput: ICreateBotReq) => {
    const res = await http.post<ICreateBotReq, AxiosResponse<IResponse>>(
      '/bot/createbot',
      botInput,
    );

    const excepton = res.data?.exception as IException;
    if (excepton) {
      return excepton.errorCode;
    }

    if (res?.data?.isSuccess) {
      queryClient.invalidateQueries(['bot-list']);
    }

    return '';
  });

  const botUpdateNameMutate = useMutation(async (args: ISaveBotReq) => {
    const res = await http.post<
      ISaveBotReq,
      AxiosResponse<IHasResult<IResponseUpdateBotIcon>>
    >('/bot/updatebotname', args);

    const exception = res.data.exception as IException;

    if (exception) {
      return exception.errorCode;
    }

    if (res.data.isSuccess) {
      queryClient.invalidateQueries(['bot-setting-info', args.botId]);
      queryClient.invalidateQueries(['bot-list']);
      queryClient.invalidateQueries(['bot-info', args.botId]);
    }

    return;
  });

  const botImageUploadMutate = useMutation(async (args: IUpdateBotIcon) => {
    const res = await http.post<
      IUpdateBotIcon,
      AxiosResponse<IHasResult<IResponseUpdateBotIcon>>
    >('/bot/updateboticon', args);

    if (res) {
      if (res.data.isSuccess) {
        queryClient.invalidateQueries(['bot-setting-info', args.botId]);
      }
      return res;
    }
  });

  const botActivateMutate = useMutation(async (args: IUpdateBotActivate) => {
    const res = await http.post<
      IUpdateBotActivate,
      AxiosResponse<IHasResult<IResponseUpdateBotIcon>>
    >('/bot/updatebotactivate', args);
    const exception = res.data.exception as IException;

    if (exception) {
      queryClient.invalidateQueries(['bot-setting-info', args.botId]);
      return exception.errorCode;
    }

    if (res.data.isSuccess) {
      queryClient.invalidateQueries(['bot-setting-info', args.botId]);
      queryClient.invalidateQueries(['bot-list']);
      queryClient.invalidateQueries(['bot-info', args.botId]);
      return res;
    }
    return;
  });

  const botChannelActivateMutate = useMutation(async (args: IUpdateChannelActivate) => {
    const res = await http.post<
      IUpdateChannelActivate,
      AxiosResponse<IHasResult<IResponseUpdateBotIcon>>
    >('/bot/updatechannelactivate', args);

    const exception = res.data.exception as IException;

    if (exception) {
      return exception.errorCode;
    }

    if (res.data.isSuccess) {
      queryClient.invalidateQueries(['bot-setting-info', args.botId]);
      return res;
    }
  });

  const botExportMutate = useMutation(async (args: IBotSetting) => {
    const res = await http.post('/bot/exportcurrentflowgroup', args, {
      responseType: 'blob',
    });

    if (res) {
      const blob = new Blob([res.data]);
      saveAs(blob, `Lunatalk_${args.botName}_${args.botId}.json`);
      return true;
    }
  });

  const botImportMutate = useMutation(async (args: IImportFlowGroup) => {
    const formData = new FormData();
    formData.append('file', args.file);
    formData.append('botId', args.botId);

    const res = await http.post('/Bot/ImportFlowGroup', formData);

    const exception = res.data.exception as IException;

    if (exception) {
      return exception.errorCode;
    }

    if (res.data) {
      queryClient.invalidateQueries(['bot-setting-info', args.botId]);
      return res.data;
    }
  });

  const botDeleteMutate = useMutation(async (args: IBotSetting) => {
    const res = await http.post<
      IBotSetting,
      AxiosResponse<IHasResult<IResponseUpdateBotIcon>>
    >('/bot/deletebot', args);

    const exception = res.data.exception as IException;

    if (exception) {
      return exception.errorCode;
    }

    if (res.data.isSuccess) {
      queryClient.invalidateQueries(['bot-setting-info', args.botId]);
      return res;
    }
  });

  const botRecoverMutate = useMutation(async (args: IBotSetting) => {
    const res = await http.post<
      IBotSetting,
      AxiosResponse<IHasResult<IResponseUpdateBotIcon>>
    >('/bot/recoverbot', args);

    const exception = res.data.exception as IException;

    if (exception) {
      return exception.errorCode;
    }

    if (res.data.isSuccess) {
      queryClient.invalidateQueries(['bot-setting-info', args.botId]);
      return res;
    }
  });

  return {
    getBotListQuery,
    getCachedBotList,
    getBotInfoQuery,
    getBotSettingInfoQuery,
    refetchBotInfo,
    refetchBotSettingInfo,
    botExportAsync: botExportMutate.mutateAsync,
    botImportAsync: botImportMutate.mutateAsync,
    botSaveAsync: botSaveMutate.mutateAsync,
    botDeleteAsync: botDeleteMutate.mutateAsync,
    botRecoverAsync: botRecoverMutate.mutateAsync,
    botUpdateNameAsync: botUpdateNameMutate.mutateAsync,
    botActivateAsync: botActivateMutate.mutateAsync,
    botChannelActivateAsync: botChannelActivateMutate.mutateAsync,
    botImageUploadAsync: botImageUploadMutate.mutateAsync,
  };
};
