import { useRootState } from '@hooks/useRootState';
import { IScenarioModel } from '@models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { useHttp } from '../useHttp';

export const useScenarioClient = () => {
  const queryClient = useQueryClient();
  const token = useRootState((state) => state.botBuilderReducer.token);
  const http = useHttp();
  const { botId } = useParams();
  const getScenarioList = useQuery<IScenarioModel[]>(['scenario-list', botId], () =>
    http
      .post('/builder/getflowInfos', {
        sessionToken: token,
      })
      .then((res) => res.data.result),
  );

  const scenarioSaveMutate = useMutation(async (scenarioName: string) => {
    const res = await http.post(
      `https://634d41c1f5d2cc648ea0bf80.mockapi.io/bot-list/${botId}/scenario-list`,
      { scenarioName },
    );

    if (res) {
      queryClient.invalidateQueries(['scenario-list', botId]);
      return res;
    }
  });

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
    scenarioSaveAsync: scenarioSaveMutate.mutateAsync,
    scenarioUpdateAsync: scenarioUpdateMutate.mutateAsync,
    scenarioDeleteAsync: scenarioDeleteMutate.mutateAsync,
  };
};
