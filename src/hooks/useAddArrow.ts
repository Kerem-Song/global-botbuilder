import { IArrow, INode } from '@models';
import { arrowHelper } from '@modules/arrowHelper';
import { lunaToast } from '@modules/lunaToast';
import { addArrow } from '@store/makingNode';
import { useDispatch } from 'react-redux';

import useI18n from './useI18n';

export const useAddArrow = () => {
  const dispatch = useDispatch();
  const { tc } = useI18n();
  const addArrowHandler = (nodes: INode[], arrow: IArrow) => {
    dispatch(addArrow({ arrow }));
  };
  return { addArrowHandler };
};
