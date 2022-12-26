import { Input, InputTextarea } from '@components';
import { useRootState } from '@hooks';
import { IBasicCard, INode } from '@models';
import { setEditDrawerToggle, setSelected } from '@store/botbuilderSlice';
import { updateNode } from '@store/makingNode';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Drawer from 'react-modern-drawer';
import { useDispatch } from 'react-redux';

export const NodeEditDrawer = () => {
  const dispatch = useDispatch();

  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const isEditDrawerOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );

  const selected = useRootState((state) => state.botBuilderReducer.selected);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<INode>();

  const onSubmit = (node: INode) => {
    dispatch(updateNode(node));
    //dispatch(setSelected());
  };
  const selectedNode = nodes.find((x) => x.id === selected);
  useEffect(() => {
    if (selectedNode) {
      reset(selectedNode);
    } else {
      handleSubmit(onSubmit)();
      reset({ id: '', title: '' });
      dispatch(setEditDrawerToggle(false));
    }
  }, [selectedNode]);

  return (
    <Drawer
      className="botBuilderDrawer"
      open={isEditDrawerOpen}
      direction="right"
      enableOverlay={false}
      duration={200}
      size={260}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="header">
          <span>{getValues().type}</span>
        </div>
        <div className="node-item-wrap">
          <p className="m-b-8">
            <span className="label">말풍선명</span>
            <span className="required">*</span>
          </p>
          <Input placeholder="Input Chat Bubble name" {...register('title')} />
        </div>
        <div className="node-item-wrap">
          <p className="m-b-8">
            <span className="label">텍스트</span>
            <span className="required">*</span>
          </p>
        </div>
      </form>
    </Drawer>
  );
};
