import { useRootState } from '@hooks/useRootState';
import { IHasResults, IScenarioModel } from '@models';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { useHttp } from '../useHttp';

export const SCENARIO_LIST_SELECT_QUERY_KEY = 'scenario-list-select';

export const useScenarioSelectClient = () => {
  const http = useHttp();
  const { botId } = useParams();
  const token = useRootState((state) => state.botInfoReducer.token);

  const getScenarioList = () => {
    return useQuery<IScenarioModel[]>(
      [SCENARIO_LIST_SELECT_QUERY_KEY, botId],
      () =>
        http
          .post<string, AxiosResponse<IHasResults<IScenarioModel>>>(
            '/builder/getflowInfos',
            {
              sessionToken: token,
            },
          )
          .then((res) => {
            const scenarios = res.data.result;
            const startScenario = scenarios.find((x) => x.isStartFlow);
            const restScenarios = scenarios
              .filter((x) => !x.isFallbackFlow && !x.isStartFlow)
              .filter((x) => x.activated)
              .sort((a, b) => (a.seq > b.seq ? 1 : -1));
            return [startScenario!, ...restScenarios];
          }),
      {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        enabled: token !== undefined,
      },
    );
  };

  return {
    getScenarioList,
  };
};
