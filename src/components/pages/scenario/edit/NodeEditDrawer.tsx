import { FormItem, Input } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRootState } from '@hooks';
import { NODE_TYPES } from '@models';
import { INodeEditModel } from '@models/interfaces/INodeEditModel';
import { setEditDrawerToggle } from '@store/botbuilderSlice';
import { editNode } from '@store/makingNode';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Drawer from 'react-modern-drawer';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import { AnswerNodeEdit } from './AnswerNodeEdit';
import { BasicCardNodeEdit } from './BasicCardNodeEdit';
import { ConditionNodeEdit } from './ConditionNodeEdit';
import { ListCardNodeEdit } from './ListCardNodeEdit';
import { ProductCardNodeEdit } from './ProductCardNodeEdit';
import { TextNodeEdit } from './TextNodeEdit';

export const NodeEditDrawer = () => {
  const dispatch = useDispatch();

  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const isEditDrawerOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );

  const selected = useRootState((state) => state.botBuilderReducer.selected);

  const schema = yup
    .object({
      title: yup.string().required('말풍선 명은 필수입니다.'),
      view: yup.object().when('nodeType', {
        is: NODE_TYPES.CONDITION_NODE,
        then: yup.object().shape({
          items: yup.array().of(
            yup.object().shape({
              op1: yup.string().required(`변수 입력은 필수 입니다.`),
              op2: yup.string().required(`변수 입력은 필수 입니다.`),
              operator: yup.number().required(`Operator 설정은 필수 입니다.`),
            }),
          ),
          trueThenNextNodeId: yup.string().required(`Message connection은 필수입니다.`),
          falseThenNextNodeId: yup.string().required(`Next message는 필수입니다.`),
        }),
      }),
    })
    .required();

  const selectedNode = nodes.find((x) => x.id === selected);

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
    console.log(node);

    dispatch(editNode(node));
    //dispatch(setSelected());
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

      reset(model);
    } else {
      handleSubmit(onSubmit)();
      if (!isValid) {
        return;
      }

      reset({ id: '', title: '' });

      dispatch(setEditDrawerToggle(false));
    }
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
              <p className="m-b-8">
                <span className="label">말풍선명</span>
                <span className="required">*</span>
              </p>
              <FormItem error={errors.title}>
                <Input placeholder="Input Chat Bubble name" {...register('title')} />
              </FormItem>
            </div>
            {editItem()}
          </form>
        </FormProvider>
      </div>
    </Drawer>
  );
};
