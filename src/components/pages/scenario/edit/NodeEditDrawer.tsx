import { FormItem } from '@components';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { NODE_TYPES } from '@models';
import { INodeEditModel } from '@models/interfaces/INodeEditModel';
import { IAnswerView, IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import { NODE_PREFIX } from '@modules';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Drawer from 'react-modern-drawer';
import { useDispatch } from 'react-redux';

import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const NodeEditDrawer = () => {
  console.log('^^^^ NodeEditDrawer');
  const { t } = usePage();
  const [showAnnotation, setShowAnnotation] = useState<boolean>(false);
  const dispatch = useDispatch();
  const isHistoryViewer = useHistoryViewerMatch();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const isEditDrawerOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  console.log(carouselIndexObj);

  const selectedNode = nodes.find((x) => x.id === selected);
  const index = carouselIndexObj[`${NODE_PREFIX}${selectedNode?.id}`];

  const invalidateNodes = useRootState(
    (state) => state.botBuilderReducer.invalidateNodes,
  );

  const formMethods = useFormContext<INodeEditModel>();

  const {
    register,
    reset,
    getValues,
    trigger,
    watch,
    setError,
    formState: { errors, isValid },
  } = formMethods;

  useEffect(() => {
    if (selectedNode) {
      const model: INodeEditModel = {
        id: selectedNode.id,
        type: selectedNode.type,
        caption: t(`CAPTION_${selectedNode.type.toUpperCase()}`),
        title: selectedNode.title || '',
        view: selectedNode.view,
        nextNodeId: selectedNode.nextNodeId,
        option: selectedNode.option,
        annotation: selectedNode.annotation,
      };

      if (selectedNode.type === NODE_TYPES.ANSWER_NODE) {
        const view = { ...model.view } as IAnswerView;
        if (view?.utteranceParam) {
          view.useUtteranceParam = true;
        }
        model.view = view;
      }

      reset(model);
      const filtered = nodes.filter((node) => node.title === selectedNode.title);

      if (invalidateNodes[selectedNode.id]) {
        trigger();
      }
    } else {
      reset({ id: '', title: '' });
    }
  }, [selectedNode, index]);

  const editItem = () => {
    if (!isEditDrawerOpen) {
      return <></>;
    }

    if (
      index !== undefined &&
      ((selectedNode?.view as IHasChildrenView)?.childrenViews?.length || 0) <= index
    ) {
      return <></>;
    }
    const EditElement = nodeFactory.getFactory(selectedNode?.type)?.getEditElement();

    if (!EditElement) {
      return <></>;
    }

    return <EditElement />;
  };

  const handleAnnotation = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.code === 'KeyQ') {
      setShowAnnotation(!showAnnotation);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', (e) => handleAnnotation(e));

    return () => {
      window.removeEventListener('keydown', (e) => handleAnnotation(e));
    };
  }, [showAnnotation]);

  console.log('errors in edit drawer', errors);
  return (
    <Drawer
      className="botBuilderDrawer"
      open={isEditDrawerOpen}
      direction="right"
      enableOverlay={false}
      duration={200}
      size={360}
    >
      <div className="wrapper" role="tab" tabIndex={0}>
        <div className="header">
          <span>{getValues().caption}</span>
        </div>

        <div className="node-item-wrap">
          <FormItem error={errors.title}>
            {selectedNode?.type === NODE_TYPES.INTENT_NODE ? (
              <InputWithTitleCounter
                label={t(`CHAT_SCENARIO_NAME`)}
                required={true}
                placeholder="Input Chat Bubble name"
                disabled
                readOnly
                value={selectedScenario?.alias}
              />
            ) : (
              <InputWithTitleCounter
                label={t(`CHAT_BUBBLE_NAME`)}
                required={true}
                placeholder="Input Chat Bubble name"
                {...register('title')}
                showCount
                maxLength={100}
                textLength={watch('title')?.length || 0}
                readOnly={isHistoryViewer}
              />
            )}
          </FormItem>
        </div>
        {showAnnotation && (
          <div className="node-item-wrap">
            <InputTextAreaWithTitleCounter label="annotation" />
          </div>
        )}
        {editItem()}
      </div>
    </Drawer>
  );
};
