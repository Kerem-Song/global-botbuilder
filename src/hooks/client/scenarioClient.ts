import { useRootState } from '@hooks/useRootState';
import { IScenarioModel } from '@models';
import { IGetFlowRes } from '@models/interfaces/res/IGetFlowRes';
import { setSelectedScenario } from '@store/botbuilderSlice';
import { initNodes } from '@store/makingNode';
import {
  QueryObserver,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
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
          .post('/builder/getflowInfos', {
            sessionToken: token,
          })
          .then((res) => {
            return res.data.result;
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

  const scenarioUpdateMutate = useMutation(async (scenario: IScenarioModel) => {
    const res = await http.put(
      `https://634d41c1f5d2cc648ea0bf80.mockapi.io/bot-list/${botId}/scenario-list/${scenario.id}`,
      scenario,
    );

    if (res) {
      queryClient.invalidateQueries(['scenario-list', botId]);
      return res;
    }
  });

  const scenarioDeleteMutate = useMutation(async (scenarioId: string) => {
    const res = await http.delete(
      `https://634d41c1f5d2cc648ea0bf80.mockapi.io/bot-list/${botId}/scenario-list/${scenarioId}`,
    );

    if (res) {
      queryClient.invalidateQueries(['scenario-list', botId]);
      return res;
    }
  });

  return {
    getScenarioList,
    getScenario,
    scenarioCreateAsync: scenarioCreateMutate.mutateAsync,
    scenarioUpdateAsync: scenarioUpdateMutate.mutateAsync,
    scenarioDeleteAsync: scenarioDeleteMutate.mutateAsync,
  };
};
