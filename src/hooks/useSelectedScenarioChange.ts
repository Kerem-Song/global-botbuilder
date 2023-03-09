import { IScenarioModel } from '@models';
import { setSelectedScenario } from '@store/botbuilderSlice';
import { createElement } from 'react';
import { useDispatch } from 'react-redux';

import { useRootState } from './useRootState';
import { useSystemModal } from './useSystemModal';

export const useSelectedScenarioChange = () => {
  const dispatch = useDispatch();
  const { confirm } = useSystemModal();
  const changed = useRootState((state) => state.makingNodeSliceReducer.present.changed);

  const handleChangeSelectedScenario = async (item?: IScenarioModel) => {
    if (changed) {
      const message = createElement(
        'span',
        { style: { whiteSpace: 'pre-line' } },
        '변경사항이 저장되지 않았습니다.\n정말 나가시겠습니까?',
      );
      const result = await confirm({
        title: '저장하기',
        description: message,
      });

      if (!result) {
        return false;
      }
    }
    dispatch(setSelectedScenario(item));
    return true;
  };

  return { handleChangeSelectedScenario };
};
