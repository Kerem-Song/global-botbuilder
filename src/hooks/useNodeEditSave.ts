import { useHistoryViewerMatch } from '@hooks';
import { INodeEditModel } from '@models';
import { NODE_PREFIX } from '@modules';
import { setInvalidateNode } from '@store/botbuilderSlice';
import { editNode } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { useRootState } from './useRootState';

export const useNodeEditSave = () => {
  const [isChanged, setIsChanged] = useState(false);
  const dispatch = useDispatch();
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const isHistoryViewer = useHistoryViewerMatch();
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
    console.log('handleSave');
    const model = getValues();
    trigger().then((isValid) => {
      dispatch(setInvalidateNode({ id: model.id, isValid }));
    });
    dispatch(editNode(model));
    reset({ id: '', title: '' });
  };

  useEffect(() => {
    console.log('isDirty', isDirty);
    if (isDirty) {
      setIsChanged(true);
    }
  }, [isDirty]);

  useEffect(() => {
    console.log('@@@@useEffect');
    return () => {
      console.log('@@@@useEffect callback');
      if (/*isChanged &&*/ selectedNode && index === undefined && !isHistoryViewer) {
        handleSave();
      }
    };
  }, [selected /*, isChanged*/]);

  useEffect(() => {
    return () => {
      if (/*isChanged &&*/ selectedNode && index !== undefined && !isHistoryViewer) {
        handleSave();
      }
    };
  }, [selected, index /*, isChanged*/]);
};
