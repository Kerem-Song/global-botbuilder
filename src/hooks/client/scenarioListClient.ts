import { usePage } from '@hooks';
import { useRootState } from '@hooks/useRootState';
import { IHasResults, IScenarioModel } from '@models';
import { initSelectedScenario, setBasicScenarios } from '@store/botbuilderSlice';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import * as base64 from 'base-64';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { useHttp } from '../useHttp';

const SCENARIO_LIST = 'scenario-list';

export const useScenarioListClient = (scenarioId?: string) => {
  console.log('@@@@useScenarioListClient', scenarioId);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const http = useHttp();
  const { botId } = useParams();
  const token = useRootState((state) => state.botInfoReducer.token);

  const decodedToken = base64.decode(token || '').split('\t');

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
            console.log('!@!@', scenarioId);
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

  return {
    getScenarioList,
    getCachedScenarioList,
  };
};
