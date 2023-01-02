import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IButtonType } from '@models';
import React from 'react';

import { SortableButtonItemTest } from './SortableButtonItemTest';

interface ISortableButtonItem {
  id: UniqueIdentifier;
  item: IButtonType;
}
export const SortableItemTest = ({ id, item }: ISortableButtonItem) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableButtonItemTest
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      item={item}
    ></SortableButtonItemTest>
  );
};
