import { IScenarioModel } from '@models';
import { useParams } from 'react-router';

import usePage from './usePage';

export const useSelectedScenarioChange = () => {
  const { navigate } = usePage();
  const { botId } = useParams();

  const handleChangeSelectedScenario = async (item?: IScenarioModel) => {
    if (item?.isStartFlow) {
      navigate(`/${botId}/scenario/start`);
    } else if (item?.isFallbackFlow) {
      navigate(`/${botId}/scenario/fallback`);
    } else {
      navigate(`/${botId}/scenario/${item?.id}`);
    }

    return true;
  };

  return { handleChangeSelectedScenario };
};
