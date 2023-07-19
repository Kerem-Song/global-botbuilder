import { useHistoryViewerMatch, usePage } from '@hooks';
import { useRootState } from '@hooks/useRootState';
import { IHasResults, IScenarioModel } from '@models';
import { FlowDeleteException } from '@models/exceptions/FlowDeleteException';
import { IGetFlowRes } from '@models/interfaces/res/IGetFlowRes';
import { initSelectedScenario, setBasicScenarios } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import * as base64 from 'base-64';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { ActionCreators } from 'redux-undo';

import { lunaToast } from '../../modules/lunaToast';
import { nodeHelper } from '../../modules/nodeHelper';
import { useHttp } from '../useHttp';
import { SCENARIO_LIST_SELECT_QUERY_KEY } from './scenarioSelectClient';

const SCENARIO_LIST = 'scenario-list';

export const useScenarioClient = () => {
  const { tc } = usePage();
  const isHistoryViewer = useHistoryViewerMatch();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const http = useHttp();
  const { botId, scenarioId } = useParams();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const token = useRootState((state) => state.botInfoReducer.token);

  const decodedToken = base64.decode(token || '').split('\t');

  const invalidateScenario = (scenarioId: string) => {
    queryClient.invalidateQueries(['scenario', scenarioId]);
  };

  const getScenarioList = () => {
    return useQuery<IScenarioModel[]>(
      [SCENARIO_LIST, botId],
      () => {
        return http
          .post<string, AxiosResponse<IHasResults<IScenarioModel>>>(
            '/builder/getflowInfos',
            {
              sessionToken: token,
            },
          )
          .then((res) => {
            const basicScenarios: IScenarioModel[] = [];
            const scenarios = res.data.result;
            const fallbackScenario = scenarios.find((x) => x.isFallbackFlow);
            const startScenario = scenarios.find((x) => x.isStartFlow);
            if (fallbackScenario) {
              basicScenarios.push(fallbackScenario);
            }

            if (startScenario) {
              basicScenarios.push(startScenario);
            }

            // 기본 시나리오 세팅
            dispatch(setBasicScenarios(basicScenarios));
            dispatch(initSelectedScenario({ scenarios, scenarioId }));

            const restScenarios = scenarios
              .filter((x) => !x.isFallbackFlow && !x.isStartFlow)
              .sort((a, b) => (a.seq > b.seq ? 1 : -1));
            return [...basicScenarios, ...restScenarios];
          });
      },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        enabled:
          token !== undefined &&
          decodedToken &&
          decodedToken.length > 2 &&
          decodedToken[2] === botId,
      },
    );
  };

  const getCachedScenarioList = (botId?: string): IScenarioModel[] | undefined => {
    if (!botId) {
      return undefined;
    }
    return queryClient.getQueryData<IScenarioModel[]>([SCENARIO_LIST, botId]);
  };

  const getScenario = (scenarioId?: string) => {
    return useQuery<IGetFlowRes>(
      ['scenario', scenarioId],
      async () => {
        if (!scenarioId) {
          return [];
        }

        const res = await http.post('/builder/getflow', {
          sessionToken: token,
          flowId: scenarioId,
        });

        if (res) {
          dispatch(initNodes(res.data.result.nodes));
          dispatch(ActionCreators.clearHistory());
          return res.data.result;
        }
      },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        enabled: token !== undefined && !isHistoryViewer,
      },
    );
  };

  const getCachedScenario = (scenarioId?: string): IGetFlowRes | undefined => {
    if (!scenarioId) {
      return undefined;
    }
    return queryClient.getQueryData<IGetFlowRes>(['scenario', scenarioId]);
  };

  const scenarioCreateMutate = useMutation(
    async ({ token, scenarioName }: { token: string; scenarioName: string }) => {
      const res = await http.post('/builder/createflow', {
        sessionToken: token,
        alias: scenarioName,
      });

      if (res) {
        queryClient.invalidateQueries([SCENARIO_LIST_SELECT_QUERY_KEY, botId]);
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  const scenarioRenameMutate = useMutation(
    async ({ token, scenario }: { token: string; scenario: IScenarioModel }) => {
      const res = await http.post('/builder/renameflow', {
        sessionToken: token,
        flowId: scenario.id,
        name: scenario.alias,
      });

      if (res && res.data?.isSuccess) {
        queryClient.invalidateQueries([SCENARIO_LIST_SELECT_QUERY_KEY, botId]);
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  const scenarioActivateMutate = useMutation(
    async ({ flowId, activated }: { flowId: string; activated: boolean }) => {
      const res = await http.post('/builder/activateflow', {
        sessionToken: token,
        flowId,
        activated,
      });

      if (res) {
        queryClient.invalidateQueries([SCENARIO_LIST_SELECT_QUERY_KEY, botId]);
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  const scenarioCheckDeleteMutate = useMutation(
    async ({ scenarioId }: { scenarioId: string }) => {
      const res = await http.post('builder/deletecheckflow', {
        sessionToken: token,
        flowId: scenarioId,
        isForce: false,
      });

      if (res) {
        return res.data.exception as FlowDeleteException;
      }
    },
  );

  const scenarioDeleteMutate = useMutation(
    async ({ scenarioId }: { scenarioId: string }) => {
      const res = await http.post('builder/deleteflow', {
        sessionToken: token,
        flowId: scenarioId,
        isForce: true,
      });

      if (res) {
        queryClient.invalidateQueries([SCENARIO_LIST_SELECT_QUERY_KEY, botId]);
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  const scenarioSaveMutate = useMutation(
    async ({ scenarioId }: { scenarioId: string }) => {
      const old = queryClient.getQueryData<IGetFlowRes>(['scenario', scenarioId]);
      const resultNodes = nodes.map((x) => {
        const converted = nodeHelper.convertToINodeBase(x);
        return converted;
      });
      const result = { ...old, nodes: resultNodes };

      const res = await http.post('builder/updateflow', {
        sessionToken: token,
        flow: result,
      });

      if (res) {
        lunaToast.success(tc('SAVE_MESSAGE'));
        queryClient.invalidateQueries(['scenario', scenarioId]);
        queryClient.invalidateQueries(['variable-list', token]);
        queryClient.invalidateQueries(['variable-select-list', token]);
        return res;
      }
    },
  );

  const scenarioSortMutate = useMutation(async (scenarioList: IScenarioModel[]) => {
    const payload: Record<string, number> = {};
    console.log(scenarioList);
    scenarioList.map((s, i) => {
      payload[s.id] = i;
    });
    const res = await http.post('builder/sortflows', {
      sessionToken: token,
      sequenceInfo: payload,
    });

    if (res) {
      queryClient.invalidateQueries([SCENARIO_LIST_SELECT_QUERY_KEY, botId]);
      queryClient.invalidateQueries([SCENARIO_LIST, botId]);
      return res;
    }
  });

  return {
    getScenarioList,
    getCachedScenarioList,
    getScenario,
    getCachedScenario,
    invalidateScenario,
    scenarioCreateAsync: scenarioCreateMutate.mutateAsync,
    scenarioRenameAsync: scenarioRenameMutate.mutateAsync,
    scenarioCheckDeleteAsync: scenarioCheckDeleteMutate.mutateAsync,
    scenarioDeleteAsync: scenarioDeleteMutate.mutateAsync,
    scenarioActiveAsync: scenarioActivateMutate.mutateAsync,
    scenarioSaveAsync: scenarioSaveMutate.mutateAsync,
    scenarioSortAsync: scenarioSortMutate.mutateAsync,
    scenarioSaving: scenarioSaveMutate.isLoading,
    scenarioCreating: scenarioCreateMutate.isLoading,
  };
};
