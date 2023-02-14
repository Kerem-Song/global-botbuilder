import { Button } from '@components';
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { NEXT_BUTTON_PREFIX } from '@modules';
import { setGuideStartNode } from '@store/botbuilderSlice';
import classNames from 'classnames';
import { DragEvent, FC } from 'react';
import { useDispatch } from 'react-redux';

export interface NextNodeButtonProps {
  ctrlId: string;
  nodeId: string;
  offset?: number;
  type: 'blue' | 'green' | 'red' | 'yellow';
}

export const NextNodeButton: FC<NextNodeButtonProps> = ({
  ctrlId,
  nodeId,
  offset,
  type,
}) => {
  const dispatch = useDispatch();
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const isEditting = useRootState((state) => state.botBuilderReducer.isEditDrawerOpen);
  const { updateLine } = useUpdateLines();

  const StartDrag = (e: DragEvent<HTMLDivElement>) => {
    if (isEditting) {
      return;
    }

    //const img = new Image();
    console.log(ctrlId);
    e.dataTransfer.setData('id', `${NEXT_BUTTON_PREFIX}${ctrlId}`);
    e.dataTransfer.setData('nodeId', nodeId);
    e.dataTransfer.setData('pointType', type);
    e.dataTransfer.setData('isNext', '1');
    dispatch(
      setGuideStartNode({
        startId: `${NEXT_BUTTON_PREFIX}${ctrlId}`,
        nodeId,
        isNext: true,
        type,
      }),
    );
    //e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleBottomDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const guide = document.querySelector<HTMLDivElement>('#icGuide');
    if (guide) {
      const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
      const cr = canvas?.getBoundingClientRect() || new DOMRect();
      const newPosition = {
        x: e.clientX / scale - cr.x - 11,
        y: e.clientY / scale - cr.y - 12,
      };
      guide.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
    }
    updateLine(nodeId);
  };

  return (
    <>
      <div
        role="presentation"
        className={classNames('nextNodeDrag')}
        style={{ top: offset !== undefined ? `${offset}px` : undefined }}
        id={`next-${ctrlId}`}
        draggable={!isEditting}
        onDragStart={StartDrag}
        onDragEnd={() => {
          dispatch(setGuideStartNode());
        }}
        onDrag={handleBottomDrag}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Button
          className={classNames('nextNode', type)}
          shape="ghost"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </div>
    </>
  );
};
