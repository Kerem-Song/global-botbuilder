import { icCardDelete, icCardDuplication } from '@assets';
import { IPopperItem, Popper } from '@components/navigation';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {
  IBasicCardView,
  IHasChildrenView,
  IListCardView,
  IProductCardView,
} from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';

import { SortableCarouselCtrlItem } from './SortableCarouselCtrlItem';
import { SoratbleGrid } from './SortableGrid';

interface ISortableContainer {
  nodeView: IHasChildrenView;
  nodeId: string;
  carouselNode: (IBasicCardView | IListCardView | IProductCardView)[];
  setCarouselNode: (node: (IBasicCardView | IListCardView | IProductCardView)[]) => void;
}

export const SoratbleCarouselCtrlContainer = ({
  nodeView,
  nodeId,
  carouselNode,
  setCarouselNode,
}: ISortableContainer) => {
  const [rightClickViewId, setRightClickViewId] = useState<string>();

  useEffect(() => {
    if (rightClickViewId) {
      document.addEventListener('click', handleDeleteCard);
      return () => {
        document.removeEventListener('click', handleDeleteCard);
      };
    }
  }, [rightClickViewId, setCarouselNode]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over?.id) return;

    if (active.id !== over.id && carouselNode) {
      const oldIndex = carouselNode.findIndex((item) => item.id === active.id);
      const newIndex = carouselNode.findIndex((item) => item.id === over.id);
      const sortedCarousel = arrayMove(carouselNode, oldIndex, newIndex);
      setCarouselNode(sortedCarousel);
    }
  };

  const handleDuplicationCard = () => {
    console.log('duplicate');
    // const copyRef = carouselNode.find((item) => item.id === rightClickViewId);
    // setCarouselNode([...carouselNode]);
  };

  const handleDeleteCard = () => {
    console.log('delete card');
    console.log('right in handle delete card:', rightClickViewId);
    setCarouselNode(carouselNode.filter((item) => item.id !== rightClickViewId));
  };

  const contextMenu: IPopperItem<{ action: () => void }>[] = [
    {
      id: 'duplication-carosel',
      name: 'Duplication',
      type: 'icon-front',
      icon: icCardDuplication,
      data: {
        action: handleDuplicationCard,
      },
    },
    {
      id: 'delete-carosel',
      name: 'Delete',
      type: 'icon-front',
      icon: icCardDelete,
      data: {
        action: handleDeleteCard,
      },
    },
  ];

  return (
    <DndContext
      onDragEnd={(e) => handleDragEnd(e)}
      sensors={sensors}
      collisionDetection={closestCenter}
      // modifiers={[restrictToParentElement]}
    >
      {carouselNode && (
        <SortableContext items={carouselNode}>
          <SoratbleGrid columns={5}>
            {carouselNode?.map((item, i: number) => (
              <Popper
                className="carouselPopup"
                placement="right"
                offset={[0, -100]}
                popup
                popupList
                popperItems={contextMenu}
                onChange={(m) => {
                  m.data?.action?.();
                }}
                key={i}
              >
                <div
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setRightClickViewId(item.id);
                  }}
                >
                  <SortableCarouselCtrlItem
                    key={item.id}
                    typeName={item.typeName}
                    nodeId={nodeId}
                    id={item.id}
                    item={item}
                  />
                </div>
              </Popper>
            ))}
          </SoratbleGrid>
        </SortableContext>
      )}
    </DndContext>
  );
};
