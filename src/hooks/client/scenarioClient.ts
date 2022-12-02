import { IScenarioModel } from '@models';
import { useQuery } from '@tanstack/react-query';

import { useHttp } from '../useHttp';

export const useScenarioClient = () => {
  const http = useHttp();

  const getScenarioList = useQuery<IScenarioModel[]>(['scenario-list'], () =>
    http
      .get('https://636c4e007f47ef51e145ed03.mockapi.io/api/scenario')
      .then((res) => res.data),
  );

  return { getScenarioList };
};
