import { FormItem, Input } from '@components';
import { usePage, useRootState } from '@hooks';
import { NODE_TYPES } from '@models';
import { INodeEditModel } from '@models/interfaces/INodeEditModel';
import { IAnswerView, IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import { NODE_PREFIX } from '@modules';
import { setIsDirty } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Drawer from 'react-modern-drawer';
import { useDispatch } from 'react-redux';

import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';

export const NodeEditDrawer = () => {
  const { t, isReadOnly } = usePage();
  const [showAnnotation, setShowAnnotation] = useState<boolean>(false);
  const dispatch = useDispatch();

  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const isEditDrawerOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);

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
    formState: { errors, isDirty },
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

      if (invalidateNodes[selectedNode.id]) {
        trigger();
      }
    }

    return () => {
      reset({ id: '', title: '' });
    };
  }, [selectedNode?.id, index]);

  useEffect(() => {
    if (isDirty) {
      dispatch(setIsDirty(true));
    }
  }, [isDirty]);

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

    return <EditElement key={selectedNode?.id} />;
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
              <>
                <div className="textareaWrapper">
                  <p className="textareaLabel">
                    {t(`CHAT_SCENARIO_NAME`)}
                    <span className="required"> *</span>
                  </p>
                </div>
                <Input
                  placeholder={t(`CHAT_BUBBLE_NAME_PLACEHOLDER`)}
                  disabled
                  value={selectedScenario?.alias}
                />
              </>
            ) : (
              <InputWithTitleCounter
                label={t(`CHAT_BUBBLE_NAME`)}
                required={true}
                placeholder={t(`CHAT_BUBBLE_NAME_PLACEHOLDER`)}
                {...register('title')}
                showCount
                maxLength={100}
                textLength={watch('title')?.length || 0}
                readOnly={isReadOnly}
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
