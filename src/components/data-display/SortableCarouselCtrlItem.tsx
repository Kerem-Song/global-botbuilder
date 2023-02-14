import { BasicCardView } from '@components/pages/scenario/views/BasicCardView';
import { CommerceCardView } from '@components/pages/scenario/views/CommerceCardView';
import { ListCardView } from '@components/pages/scenario/views/ListCardView';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IBasicCardView,
  IListCardView,
  IProductCardView,
} from '@models/interfaces/res/IGetFlowRes';

interface ISortableCarouselItemProps {
  id: UniqueIdentifier;
  nodeId: string;
  item: IBasicCardView | IListCardView | IProductCardView;
  typeName: string;
}
export const SortableCarouselCtrlItem = ({
  id,
  nodeId,
  typeName,
  item,
}: ISortableCarouselItemProps) => {
  const sortable = useSortable({ id });
  const { attributes, listeners, isDragging, setNodeRef, transform, transition } =
    sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {typeName === 'BasicCardView' && (
        <BasicCardView key={id} nodeId={nodeId} view={item as IBasicCardView} />
      )}
      {typeName === 'ListCardView' && (
        <ListCardView key={id} nodeId={nodeId} view={item as IListCardView} />
      )}
      {typeName === 'ProductCardView' && (
        <CommerceCardView nodeId={nodeId} view={item as IProductCardView} />
      )}
    </div>
  );
};
