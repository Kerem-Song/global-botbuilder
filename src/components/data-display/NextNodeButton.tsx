import { Button } from '@components';
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { setGuideStartNode } from '@store/botbuilderSlice';
import classNames from 'classnames';
import { DragEvent, FC } from 'react';
import { useDispatch } from 'react-redux';

export interface NextNodeButtonProps {
  ctrlId: string;
  nodeId: string;
  type: 'blue' | 'green' | 'red' | 'yellow';
}

export const NextNodeButton: FC<NextNodeButtonProps> = ({ ctrlId, nodeId, type }) => {
  const dispatch = useDispatch();
  const arrows = useRootState((state) => state.makingNodeSliceReducer.present.arrows);
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const { updateLine } = useUpdateLines();

  const StartDrag = (e: DragEvent<HTMLDivElement>) => {
    if (arrows.find((x) => x.start === `next-${ctrlId}`)) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    //const img = new Image();
    e.dataTransfer.setData('id', `next-${ctrlId}`);
    e.dataTransfer.setData('nodeId', nodeId);
    e.dataTransfer.setData('pointType', type);
    e.dataTransfer.setData('isNext', '1');
    dispatch(
      setGuideStartNode({
        startId: `next-${ctrlId}`,
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
        className={classNames('nextNodeDrag', type)}
        id={`next-${ctrlId}`}
        draggable
        onDragStart={StartDrag}
        onDragEnd={(e) => {
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
