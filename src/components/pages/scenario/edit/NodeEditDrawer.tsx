import { Input } from '@components';
import { useRootState } from '@hooks';
import { IBasicCard, NODE_TYPES } from '@models';
import { INodeEditModel } from '@models/interfaces/INodeEditModel';
import { setEditDrawerToggle } from '@store/botbuilderSlice';
import { editNode } from '@store/makingNode';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Drawer from 'react-modern-drawer';
import { useDispatch } from 'react-redux';

import { BasicCardNodeEdit } from './BasicCardNodeEdit';
import { TextNodeEdit } from './TextNodeEdit';

export const NodeEditDrawer = () => {
  const dispatch = useDispatch();

  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const isEditDrawerOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );

  const selected = useRootState((state) => state.botBuilderReducer.selected);

  const formMethods = useForm<INodeEditModel>();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = formMethods;

  const onSubmit = (node: INodeEditModel) => {
    console.log(node);
    dispatch(editNode(node));
    //dispatch(setSelected());
  };
  const selectedNode = nodes.find((x) => x.id === selected);
  useEffect(() => {
    if (selectedNode) {
      const model: INodeEditModel = {
        id: selectedNode.id,
        caption: selectedNode.type,
        title: selectedNode.title || '',
        view: { text: '' },
      };
      console.log(selectedNode);
      if (selectedNode.type === NODE_TYPES.TEXT_NODE) {
        const card: IBasicCard = selectedNode.cards?.[0] as IBasicCard;
        if (card) {
          model.view = { text: card.description };
        }
      }

      if (selectedNode.type === NODE_TYPES.BASIC_CARD_NODE) {
        const card: IBasicCard = selectedNode.cards?.[0] as IBasicCard;
        if (card) {
          model.view = {
            title: card.title,
            description: card.description,
            buttons: card.buttons,
          };
        }
      }
      reset(model);
    } else {
      handleSubmit(onSubmit)();
      reset({ id: '', title: '' });
      dispatch(setEditDrawerToggle(false));
    }
  }, [selectedNode]);

  const editItem = () => {
    switch (selectedNode?.type) {
      case 'TextNode':
        return <TextNodeEdit />;
      case 'BasicCardNode':
        return <BasicCardNodeEdit />;
      default:
        <></>;
    }
  };

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
              <Input placeholder="Input Chat Bubble name" {...register('title')} />
            </div>
            {editItem()}
          </form>
        </FormProvider>
      </div>
    </Drawer>
  );
};
