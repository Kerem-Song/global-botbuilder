import { useHistoryViewerMatch } from '@hooks';
import { useRootState } from '@hooks/useRootState';
import { IGetFlowRes } from '@models/interfaces/res/IGetFlowRes';
import { initNodes } from '@store/makingNode';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import { useHttp } from '../useHttp';

export const useScenarioBoardClient = () => {
  const isHistoryViewer = useHistoryViewerMatch();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const http = useHttp();
  const token = useRootState((state) => state.botInfoReducer.token);
  const invalidateScenario = (scenarioId: string) => {
    queryClient.invalidateQueries(['scenario', scenarioId]);
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

  return {
    getScenario,
    getCachedScenario,
    invalidateScenario,
  };
};
