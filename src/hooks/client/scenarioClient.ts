import { usePage } from '@hooks';
import { useRootState } from '@hooks/useRootState';
import { IScenarioModel } from '@models';
import { FlowDeleteException } from '@models/exceptions/FlowDeleteException';
import { IGetFlowRes } from '@models/interfaces/res/IGetFlowRes';
import { setUseMovingStartPoint } from '@store/botbuilderSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { lunaToast } from '../../modules/lunaToast';
import { nodeHelper } from '../../modules/nodeHelper';
import { useHttp } from '../useHttp';
import { SCENARIO_LIST_SELECT_QUERY_KEY } from './scenarioSelectClient';

const SCENARIO_LIST = 'scenario-list';

export const useScenarioClient = () => {
  const dispatch = useDispatch();
  const { tc } = usePage();
  const queryClient = useQueryClient();
  const http = useHttp();
  const { botId } = useParams();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const token = useRootState((state) => state.botInfoReducer.token);

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
    async ({ scenario }: { scenario: IScenarioModel }) => {
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
        queryClient.invalidateQueries(['parameter-list', token]);
        dispatch(setUseMovingStartPoint(false));
        return res;
      } else {
        dispatch(setUseMovingStartPoint(true));
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

  const scenarioDuplicateMutate = useMutation(
    async ({ scenario }: { scenario: IScenarioModel }) => {
      const res = await http.post('builder/copyflow', {
        sessionToken: token,
        flowId: scenario.id,
        name: scenario.alias,
      });

      if (res) {
        queryClient.invalidateQueries([SCENARIO_LIST_SELECT_QUERY_KEY, botId]);
        queryClient.invalidateQueries([SCENARIO_LIST, botId]);
        return res;
      }
    },
  );

  return {
    scenarioCreateAsync: scenarioCreateMutate.mutateAsync,
    scenarioRenameAsync: scenarioRenameMutate.mutateAsync,
    scenarioCheckDeleteAsync: scenarioCheckDeleteMutate.mutateAsync,
    scenarioDeleteAsync: scenarioDeleteMutate.mutateAsync,
    scenarioActiveAsync: scenarioActivateMutate.mutateAsync,
    scenarioSaveAsync: scenarioSaveMutate.mutateAsync,
    scenarioSortAsync: scenarioSortMutate.mutateAsync,
    scenarioDuplicateMutateAsync: scenarioDuplicateMutate.mutateAsync,
    scenarioSaving: scenarioSaveMutate.isLoading,
    scenarioSavingIsIdle: scenarioSaveMutate.status,
    scenarioCreating: scenarioCreateMutate.isLoading,
  };
};
