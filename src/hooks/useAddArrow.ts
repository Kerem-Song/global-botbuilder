import { IArrow } from '@models';
import { arrowHelper } from '@modules/arrowHelper';
import { lunaToast } from '@modules/lunaToast';
import { addArrow } from '@store/makingNode';
import { useDispatch } from 'react-redux';

import useI18n from './useI18n';
import { useRootState } from './useRootState';
export const useAddArrow = () => {
  const dispatch = useDispatch();
  const { tc } = useI18n();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const addArrowHandler = (arrow: IArrow) => {
    const errorMessage = arrowHelper.validateArrows(
      arrow.updateKey || arrow.start,
      arrow.end,
      nodes,
      arrow.isNextNode,
    );
    if (errorMessage) {
      console.log(errorMessage);
      lunaToast.error(tc('INVALIDATE_ARROW'));
      return;
    }

    dispatch(addArrow(arrow));
  };
  return { addArrowHandler };
};
