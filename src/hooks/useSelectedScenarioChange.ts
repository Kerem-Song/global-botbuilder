import { IScenarioModel } from '@models';
import { setSelectedScenario } from '@store/botbuilderSlice';
import { createElement } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import usePage from './usePage';
import { useRootState } from './useRootState';
import { useSystemModal } from './useSystemModal';

export const useSelectedScenarioChange = () => {
  const { tc, navigate } = usePage();
  const { botId } = useParams();
  const dispatch = useDispatch();
  const { confirm } = useSystemModal();
  const changed = useRootState((state) => state.makingNodeSliceReducer.present.changed);

  const handleChangeSelectedScenario = async (item?: IScenarioModel) => {
    if (changed) {
      const message = createElement(
        'span',
        { style: { whiteSpace: 'pre-line' } },
        tc('SAVE_CONFIRM_MESSAGE'),
      );
      const result = await confirm({
        title: tc('SAVE_CONFIRM_TITLE'),
        description: message,
      });

      if (!result) {
        return false;
      }
    }
    // dispatch(setSelectedScenario(item));
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
