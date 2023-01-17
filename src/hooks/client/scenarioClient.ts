import { IHasResults, IScenarioModel } from '@models';
import { IGetFlowRes } from '@models/interfaces/res/IGetFlowRes';
import { setBasicScenarios } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { ActionCreators } from 'redux-undo';

import { useHttp } from '../useHttp';

export const useScenarioClient = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const http = useHttp();
  const { botId } = useParams();

  const getScenarioList = (token: string) => {
    return useQuery<IScenarioModel[]>(
      ['scenario-list', botId],
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
            return res.data.result
              .filter((x) => !x.isFallbackFlow && !x.isStartFlow)
              .sort((a, b) => (a.seq > b.seq ? 1 : -1));
          }),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
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
        queryClient.invalidateQueries(['scenario-list', botId]);
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
        queryClient.invalidateQueries(['scenario-list', botId]);
        return res;
      }
    },
  );

  return {
    getScenarioList,
    getScenario,
    scenarioCreateAsync: scenarioCreateMutate.mutateAsync,
    scenarioRenameAsync: scenarioRenameMutate.mutateAsync,
    scenarioDeleteAsync: scenarioDeleteMutate.mutateAsync,
  };
};
