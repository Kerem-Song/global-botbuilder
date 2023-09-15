import { useHistoryViewerMatch, usePage } from '@hooks';
import { INodeEditModel } from '@models';
import { NODE_PREFIX } from '@modules';
import { setInvalidateNode } from '@store/botbuilderSlice';
import { editNode } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { useRootState } from './useRootState';

export const useNodeEditSave = () => {
  const dispatch = useDispatch();
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const { isReadOnly } = usePage();
  const selectedNode = nodes.find((x) => x.id === selected);
  const {
    getValues,
    trigger,
    reset,
    watch,
    formState: { isDirty, dirtyFields },
  } = useFormContext<INodeEditModel>();
  const index = carouselIndexObj[`${NODE_PREFIX}${selectedNode?.id}`];
  const viewId = watch('view.id');

  useEffect(() => {
    // reset();
    trigger();
  }, [viewId]);

  const handleSave = () => {
    const model = getValues();
    trigger().then((isValid) => {
      dispatch(setInvalidateNode({ id: model.id, isValid }));
    });

    console.log('isDirty', isDirty);
    console.log('dirtyFields', dirtyFields);

    if (Object.entries(dirtyFields).length > 0) {
      dispatch(editNode(model));

      reset({ id: '', title: '' });
    }
  };

  useEffect(() => {
    return () => {
      if (selectedNode && index === undefined && !isReadOnly) {
        handleSave();
      }
    };
  }, [selected, isDirty]);

  useEffect(() => {
    return () => {
      if (selectedNode && index !== undefined && !isReadOnly) {
        handleSave();
      }
    };
  }, [selected, index, isDirty]);
};
