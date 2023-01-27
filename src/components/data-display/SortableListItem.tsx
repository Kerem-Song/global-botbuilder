import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ISortableListItem } from '@models';
import { IListCardItem } from '@models/interfaces/res/IGetFlowRes';

import { SortableListCardItem } from './SortableListCardItem';

export const SortableListItem = ({ item }: { item: IListCardItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SortableListCardItem item={item} />
    </div>
  );
};
