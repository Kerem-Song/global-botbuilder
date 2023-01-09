import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IButtonType } from '@models';
import React, { useEffect } from 'react';

interface ISortableButtonItem extends IButtonType {
  nodeId: string;
  cardId: number;
}
export const SortableButtonItem = ({
  id,
  label,
  action,
  nodeId,
  cardId,
}: ISortableButtonItem) => {
  const { updateLine } = useUpdateLines();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  useEffect(() => {
    updateLine(nodeId);

    return () => {
      updateLine(nodeId);
    };
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingTop: '4px',
  };

  const handleBlueNodeBtn = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Button key={`card-${cardId}-button-${id}`} onClick={() => console.log('button')}>
        {label}
      </Button>
    </div>
  );
};
