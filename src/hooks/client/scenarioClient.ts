import { useRootState } from '@hooks/useRootState';
import { IHasResults, IScenarioModel } from '@models';
import { IGetFlowRes } from '@models/interfaces/res/IGetFlowRes';
import { setBasicScenarios, setSelectedScenario } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { ActionCreators } from 'redux-undo';

import { lunaToast } from '../../modules/lunaToast';
import { nodeHelper } from '../../modules/nodeHelper';
import { useHttp } from '../useHttp';

const SCENARIO_LIST = 'scenario-list';

export const useScenarioClient = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const http = useHttp();
  const { botId } = useParams();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const token = useRootState((state) => state.botInfoReducer.token);
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );

  const getScenarioList = () => {
    return useQuery<IScenarioModel[]>(
      [SCENARIO_LIST, botId],
      () =>
        http
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

            dispatch(setBasicScenarios(basicScenarios));

            if (
              !selectedScenario ||
              !scenarios.find((x) => x.id === selectedScenario.id)
            ) {
              dispatch(setSelectedScenario(fallbackScenario));
            } else {
              queryClient.invalidateQueries(['scenario', selectedScenario.id]);
            }

            const restScenarios = scenarios
              .filter((x) => !x.isFallbackFlow && !x.isStartFlow)
              .sort((a, b) => (a.seq > b.seq ? 1 : -1));
            return [...basicScenarios, ...restScenarios];
          }),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const getCachedScenarioList = (botId?: string): IScenarioModel[] | undefined => {
    if (!botId) {
      return undefined;
    }
    return queryClient.getQueryData<IScenarioModel[]>(['scenario-list', botId]);
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
      { refetchOnWindowFocus: false, refetchOnMount: true },
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
        queryClient.invalidateQueries(['scenario-list', botId]);
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

      if (res) {
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  const scenarioActivateMutate = useMutation(
    async ({
      token,
      flowId,
      activated,
    }: {
      token: string;
      flowId: string;
      activated: boolean;
    }) => {
      const res = await http.post('/builder/activateflow', {
        sessionToken: token,
        flowId,
        activated,
      });

      if (res) {
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  const scenarioDeleteMutate = useMutation(
    async ({ token, scenarioId }: { token: string; scenarioId: string }) => {
      const res = await http.post('builder/deleteflow', {
        sessionToken: token,
        flowId: scenarioId,
        isForce: false,
      });

      if (res) {
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
        lunaToast.success();
        queryClient.invalidateQueries(['scenario', scenarioId]);
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
      queryClient.invalidateQueries([SCENARIO_LIST, botId]);
      return res;
    }
  });

  return {
    getScenarioList,
    getCachedScenarioList,
    getScenario,
    getCachedScenario,
    scenarioCreateAsync: scenarioCreateMutate.mutateAsync,
    scenarioRenameAsync: scenarioRenameMutate.mutateAsync,
    scenarioDeleteAsync: scenarioDeleteMutate.mutateAsync,
    scenarioActiveAsync: scenarioActivateMutate.mutateAsync,
    scenarioSaveAsync: scenarioSaveMutate.mutateAsync,
    scenarioSortAsync: scenarioSortMutate.mutateAsync,
  };
};
