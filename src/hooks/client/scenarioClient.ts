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

import { useHttp } from '../useHttp';

const SCENARIO_LIST = 'scenario-list';

export const useScenarioClient = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const http = useHttp();
  const { botId } = useParams();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);

  const getScenarioList = (token: string) => {
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
            const fallbackScenario = res.data.result.find((x) => x.isFallbackFlow);
            const startScenario = res.data.result.find((x) => x.isStartFlow);
            if (fallbackScenario) {
              basicScenarios.push(fallbackScenario);
            }

            if (startScenario) {
              basicScenarios.push(startScenario);
            }
            dispatch(setBasicScenarios(basicScenarios));
            dispatch(setSelectedScenario(fallbackScenario));
            return res.data.result
              .filter((x) => !x.isFallbackFlow && !x.isStartFlow)
              .sort((a, b) => (a.seq > b.seq ? 1 : -1));
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

  const getScenario = (token: string, scenarioId?: string) => {
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

        dispatch(initNodes(res.data.result.nodes));
        dispatch(ActionCreators.clearHistory());
        return res.data.result;
      },
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
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
    async ({ token, scenarioId }: { token: string; scenarioId: string }) => {
      const old = queryClient.getQueryData<IGetFlowRes>(['scenario', scenarioId]);
      console.log(old);
      nodes.forEach((node) => {
        const oldNode = old?.nodes.find((x) => x.id === node.id);
        if (oldNode) {
          oldNode.top = node.y;
          oldNode.left = node.x;
        }
      });
      const res = await http.post('builder/updateflow', {
        sessionToken: token,
        flow: old,
      });
      if (res) {
        queryClient.invalidateQueries(['scenario', scenarioId]);
        return res;
      }
    },
  );

  return {
    getScenarioList,
    getCachedScenarioList,
    getScenario,
    scenarioCreateAsync: scenarioCreateMutate.mutateAsync,
    scenarioRenameAsync: scenarioRenameMutate.mutateAsync,
    scenarioDeleteAsync: scenarioDeleteMutate.mutateAsync,
    scenarioActiveAsync: scenarioActivateMutate.mutateAsync,
    scenarioSaveAsync: scenarioSaveMutate.mutateAsync,
  };
};
