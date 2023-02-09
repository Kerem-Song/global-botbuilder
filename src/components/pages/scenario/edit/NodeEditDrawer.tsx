import { FormItem, Input } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRootState } from '@hooks';
import { INode, NODE_TYPES } from '@models';
import {
  basicCardNodeEditSchema,
  conditionNodeEditSchema,
  INodeEditModel,
  parameterSetNodeEditSchema,
  productCardNodeEditSchema,
  textNodeEditSchema,
} from '@models/interfaces/INodeEditModel';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import { setInvalidateNode } from '@store/botbuilderSlice';
import { editNode } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Drawer from 'react-modern-drawer';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import { AnswerNodeEdit } from './AnswerNodeEdit';
import { BasicCardNodeEdit } from './BasicCardNodeEdit';
import { ConditionNodeEdit } from './ConditionNodeEdit';
import { ListCardNodeEdit } from './ListCardNodeEdit';
import { OtherFlowRedirectNodeEdit } from './OtherFlowRedirectNodeEdit';
import { ParameterSetNodeEdit } from './ParameterSetNodeEdit';
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

  const schema = yup
    .object({
      title: yup.string().required('말풍선 명은 필수입니다.'),
      view: yup
        .object()
        .when('nodeType', {
          is: NODE_TYPES.TEXT_NODE,
          then: textNodeEditSchema,
        })
        .when('nodeType', {
          is: NODE_TYPES.BASIC_CARD_NODE,
          then: basicCardNodeEditSchema,
        })
        .when('nodeType', {
          is: NODE_TYPES.CONDITION_NODE,
          then: conditionNodeEditSchema,
        })
        .when('nodeType', {
          is: NODE_TYPES.PRODUCT_CARD_NODE,
          then: productCardNodeEditSchema,
        })
        .when('nodeType', {
          is: NODE_TYPES.PARAMETER_SET_NODE,
          then: parameterSetNodeEditSchema,
        }),
    })
    .required();

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
    formState: { errors, isValid },
  } = formMethods;

  const onSubmit = (node: INodeEditModel) => {
    dispatch(editNode(node));
    //dispatch(setSelected());
  };

  const onFakeSubmit = (node: INodeEditModel) => {
    console.log('fake');
  };

  useEffect(() => {
    if (selectedNode) {
      const model: INodeEditModel = {
        id: selectedNode.id,
        nodeType: selectedNode.type,
        caption: selectedNode.type,
        title: selectedNode.title || '',
        view: selectedNode.view,
      };

      if (selectedNode.type === NODE_TYPES.ANSWER_NODE) {
        const view = model.view as IAnswerView;
        model.view = {
          ...view,
          useUtteranceParam: view?.utteranceParam,
        } as IAnswerView;
      }

      reset(model);
      if (invalidateNodes[selectedNode.id]) {
        handleSubmit(onFakeSubmit)();
      }
    } else {
      if (node) {
        handleSubmit(onSubmit)();
        if (!isValid) {
          onSubmit(getValues());
        }
        dispatch(setInvalidateNode({ id: node.id, isValid }));
        reset({ id: '', title: '' });
      }
    }

    setNode(selectedNode);
  }, [selectedNode]);

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
          <form>
            <div className="header">
              <span>{getValues().caption}</span>
            </div>
            {selectedNode?.type !== NODE_TYPES.INTENT_NODE && (
              <div className="node-item-wrap">
                <p className="m-b-8">
                  <span className="label">말풍선명</span>
                  <span className="required">*</span>
                </p>
                <FormItem error={errors.title}>
                  <Input placeholder="Input Chat Bubble name" {...register('title')} />
                </FormItem>
              </div>
            )}

            {editItem()}
          </form>
        </FormProvider>
      </div>
    </Drawer>
  );
};
