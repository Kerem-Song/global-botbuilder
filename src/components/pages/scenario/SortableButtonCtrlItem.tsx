import { Button } from '@components/general';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { CTRL_TYPES, IButtonCtrl } from '@models/interfaces/res/IGetFlowRes';
import { useEffect } from 'react';

interface ISortableButtonCtrlItemProps extends IButtonCtrl {
  nodeId: string;
}
export const SortableButtonCtrlItem = ({
  id,
  label,
  nodeId,
  typeName,
}: ISortableButtonCtrlItemProps) => {
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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {typeName !== CTRL_TYPES.QUICK_CTRL ? (
        <Button key={`card-${nodeId}-button-${id}`} onClick={() => console.log('button')}>
          {label}
        </Button>
      ) : (
        <Button key={`${nodeId}-quickReply-${id}`} className="btnQuickRelply">
          {label ? label : 'Quick Reply'}
        </Button>
      )}
    </div>
  );
};
