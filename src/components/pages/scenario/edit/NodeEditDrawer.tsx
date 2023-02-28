import { FormItem, Input } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRootState } from '@hooks';
import { useYupValidation } from '@hooks/useYupValidation';
import { INode, NODE_TYPES } from '@models';
import { INodeEditModel } from '@models/interfaces/INodeEditModel';
import { IAnswerView, IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
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
  const dispatch = useDispatch();
  const [node, setNode] = useState<INode>();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const isEditDrawerOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const index = Object.values(carouselIndexObj)[0];
  const { schema } = useYupValidation();

  const selectedNode = nodes.find((x) => x.id === selected);

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
    formState: { errors, isValid },
  } = formMethods;

  const onSubmit = (node: INodeEditModel) => {
    dispatch(editNode(node));
    //dispatch(setSelected());
  };

  const validate = async () => {
    if (node) {
      const result = await schema.isValid(getValues());
      if (!result) {
        const view = node.view as IHasChildrenView;
        console.log('view length', view.childrenViews?.length);
        console.log('index', index);
        if (view.childrenViews && view.childrenViews.length < index) {
          return;
        } else {
          //onSubmit(getValues());
        }
      }
      dispatch(setInvalidateNode({ id: node.id, isValid: result }));
    }
  };

  useEffect(() => {
    if (selectedNode) {
      console.log('selected node next node id', selectedNode.nextNodeId);
      const model: INodeEditModel = {
        id: selectedNode.id,
        type: selectedNode.type,
        caption: selectedNode.type,
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
      if (node) {
        handleSubmit(onSubmit)();
        if (!isValid) {
          const view = node.view as IHasChildrenView;
          console.log('view length', view.childrenViews?.length);
          console.log('index', index);
          if (view.childrenViews && view.childrenViews.length < index) {
            return;
          } else {
            onSubmit(getValues());
          }
        }
        dispatch(setInvalidateNode({ id: node.id, isValid }));
        reset({ id: '', title: '' });
      }
    }

    setNode(selectedNode);
  }, [selectedNode, index]);

  const editItem = () => {
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
  // console.log('get values', getValues());
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
              <p className="m-b-8">
                <span className="label">말풍선명</span>
                <span className="required">*</span>
              </p>
              <FormItem error={errors.title}>
                <Input
                  placeholder="Input Chat Bubble name"
                  {...register('title')}
                  disabled={selectedNode?.type === NODE_TYPES.INTENT_NODE}
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
