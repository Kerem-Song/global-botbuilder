import { Button } from '@components/general';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IButtonType } from '@models';
import { IQuickItem } from '@models/interfaces/res/IGetFlowRes';
import React, { useEffect } from 'react';

interface ISortableButtonItemProps extends IQuickItem {
  nodeId: string;
  cardId: number;
}
export const SortableQuickButtonItem = ({
  id,
  label,
  actionType,
  nodeId,
  cardId,
}: ISortableButtonItemProps) => {
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
      <Button key={`${nodeId}-quickReply-${id}`} className="btnQuickRelply">
        {label ? label : 'Quick Reply'}
      </Button>
    </div>
  );
};
