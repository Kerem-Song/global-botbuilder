import { FormItem, Input } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePage, useRootState } from '@hooks';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { useYupValidation } from '@hooks/useYupValidation';
import { INode, NODE_TYPES } from '@models';
import { INodeEditModel } from '@models/interfaces/INodeEditModel';
import { IAnswerView, IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { setInvalidateNode } from '@store/botbuilderSlice';
import { editNode } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Drawer from 'react-modern-drawer';
import { useDispatch } from 'react-redux';

import { AnswerNodeEdit } from './AnswerNodeEdit';
import { BasicCardCarousleNodeEdit } from './BasicCardCarousleNodeEdit';
import { BasicCardNodeEdit } from './BasicCardNodeEdit';
import { ConditionNodeEdit } from './ConditionNodeEdit';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { IntentNodeEdit } from './IntentNodeEdit';
import { ListCardCarouselNodeEdit } from './ListCardCarouselNodeEdit';
import { ListCardNodeEdit } from './ListCardNodeEdit';
import { OtherFlowRedirectNodeEdit } from './OtherFlowRedirectNodeEdit';
import { ParameterSetNodeEdit } from './ParameterSetNodeEdit';
import { ProductCardCarouselNodeEdit } from './ProductCardCarouselNodeEdit';
import { ProductCardNodeEdit } from './ProductCardNodeEdit';
import { RetryConditionNodeEdit } from './RetryConditionNodeEdit';
import { TextNodeEdit } from './TextNodeEdit';

export const NodeEditDrawer = () => {
  const { t } = usePage();
  const dispatch = useDispatch();
  const isHistoryViewer = useHistoryViewerMatch();
  const { schema } = useYupValidation();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
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

  const formMethods = useForm<INodeEditModel>({
    mode: 'onSubmit',
    defaultValues: {
      ...selectedNode,
      title: undefined,
      view: { id: undefined, typeName: undefined },
    },
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    trigger,
    watch,
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
    } else {
      reset({ id: '', title: '' });
    }
  }, [selectedNode, index]);

  const onSubmit = (node: INodeEditModel) => {
    dispatch(editNode(node));
  };

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
    switch (selectedNode?.type) {
      case NODE_TYPES.TEXT_NODE:
        return <TextNodeEdit />;
      case NODE_TYPES.BASIC_CARD_NODE:
        return <BasicCardNodeEdit />;
      case NODE_TYPES.LIST_CARD_NODE:
        return <ListCardNodeEdit />;
      case NODE_TYPES.PRODUCT_CARD_NODE:
        return <ProductCardNodeEdit />;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        return <BasicCardCarousleNodeEdit />;
      case NODE_TYPES.LIST_CARD_CAROUSEL_NODE:
        return <ListCardCarouselNodeEdit />;
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
        return <ProductCardCarouselNodeEdit />;
      case NODE_TYPES.ANSWER_NODE:
        return <AnswerNodeEdit />;
      case NODE_TYPES.CONDITION_NODE:
        return <ConditionNodeEdit />;
      case NODE_TYPES.RETRY_CONDITION_NODE:
        return <RetryConditionNodeEdit />;
      case NODE_TYPES.PARAMETER_SET_NODE:
        return <ParameterSetNodeEdit />;
      case NODE_TYPES.OTHER_FLOW_REDIRECT_NODE:
        return <OtherFlowRedirectNodeEdit />;
      case NODE_TYPES.INTENT_NODE:
        return <IntentNodeEdit />;
      default:
        <></>;
    }
  };

  console.log('errors in edit drawer', errors);
  return (
    <Drawer
      className="botBuilderDrawer"
      open={isEditDrawerOpen}
      direction="right"
      enableOverlay={false}
      duration={200}
      size={260}
    >
      <div className="wrapper">
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="header">
              <span>{getValues().caption}</span>
            </div>

            <div className="node-item-wrap">
              <FormItem error={errors.title}>
                <InputWithTitleCounter
                  label={t(`CHAT_BUBBLE_NAME`)}
                  required={true}
                  showCount={true}
                  maxLength={20}
                  placeholder="Input Chat Bubble name"
                  {...register('title')}
                  disabled={selectedNode?.type === NODE_TYPES.INTENT_NODE}
                  textLength={watch('title')?.length || 0}
                  readOnly={isHistoryViewer}
                />
              </FormItem>
            </div>

            {editItem()}
          </form>
        </FormProvider>
      </div>
    </Drawer>
  );
};
