import { IScenarioModel } from '@models';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { useHttp } from '../useHttp';

export const useScenarioClient = () => {
  const http = useHttp();
  const { scenarioId } = useParams();
  const getScenarioList = useQuery<IScenarioModel[]>(['scenario-list'], () =>
    http
      .get(
        `https://634d41c1f5d2cc648ea0bf80.mockapi.io/bot-list/${scenarioId}/scenario-list`,
      )
      .then((res) => res.data),
  );

  return { getScenarioList };
};
