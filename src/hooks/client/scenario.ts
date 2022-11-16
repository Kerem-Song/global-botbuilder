import { useQuery } from '@tanstack/react-query';

import { useHttp } from './../useHttp';

interface IScenario {
  id: number;
  scenarioName: string;
}
export const useScenarioList = () => {
  const http = useHttp();

  const getScenarioList = useQuery<IScenario[]>(['scenario-list'], () =>
    http
      .get('https://636c4e007f47ef51e145ed03.mockapi.io/api/scenario')
      .then((res) => res.data),
  );

  return { getScenarioList };
};
