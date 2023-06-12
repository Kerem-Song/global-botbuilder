import { INodeEditModel } from '@models';
import { NODE_PREFIX } from '@modules';
import { setInvalidateNode } from '@store/botbuilderSlice';
import { editNode } from '@store/makingNode';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { useRootState } from './useRootState';

export const useNodeEditSave = () => {
  const dispatch = useDispatch();
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  console.log(carouselIndexObj);

  const selectedNode = nodes.find((x) => x.id === selected);
  const {
    getValues,
    trigger,
    reset,
    formState: { isDirty },
  } = useFormContext<INodeEditModel>();
  const index = carouselIndexObj[`${NODE_PREFIX}${selectedNode?.id}`];

  const handleSave = () => {
    const model = getValues();
    trigger().then((isValid) => {
      dispatch(setInvalidateNode({ id: model.id, isValid }));
    });
    dispatch(editNode(model));
    reset({ id: '', title: '' });
  };

  useEffect(() => {
    return () => {
      if (isDirty && selectedNode && index === undefined) {
        handleSave();
      }
    };
  }, [selected, isDirty]);

  useEffect(() => {
    return () => {
      if (isDirty && index !== undefined) {
        handleSave();
      }
    };
  }, [index, isDirty]);
};
