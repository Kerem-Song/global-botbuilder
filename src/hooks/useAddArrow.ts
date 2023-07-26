import { IArrow, INode } from '@models';
import { arrowHelper } from '@modules/arrowHelper';
import { lunaToast } from '@modules/lunaToast';
import { setSelected } from '@store/botbuilderSlice';
import { addArrow } from '@store/makingNode';
import { useDispatch } from 'react-redux';

import useI18n from './useI18n';
import { useRootState } from './useRootState';

export const useAddArrow = () => {
  const dispatch = useDispatch();
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const { tc } = useI18n();
  const addArrowHandler = (nodes: INode[], arrow: IArrow) => {
    dispatch(addArrow({ arrow }));
    const selctedArrow = selected as IArrow;
    if (selctedArrow && selctedArrow.start === arrow.start) {
      dispatch(setSelected(arrow));
    }
  };
  return { addArrowHandler };
};
