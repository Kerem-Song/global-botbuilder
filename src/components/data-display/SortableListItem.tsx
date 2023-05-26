import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IListCardItem } from '@models/interfaces/res/IGetFlowRes';
import { lazy, Suspense } from 'react';

import { SortableListCardItem } from './SortableListCardItem';
// const SortableListCardItem = lazy(() =>
//   import('./SortableListCardItem').then(({ SortableListCardItem }) => ({
//     default: SortableListCardItem,
//   })),
// );
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
      {/* <Suspense fallback={<div>loading list</div>}> */}
      <SortableListCardItem item={item} />
      {/* </Suspense> */}
    </div>
  );
};
