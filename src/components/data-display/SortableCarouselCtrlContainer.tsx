import { icCardDelete, icCardDuplication, icCardDuplicationDisabled } from '@assets';
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
import { usePage } from '@hooks';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { IChildrenViewEnum, IHasChildrenView } from '@models/interfaces/res/IGetFlowRes';
import { nodeHelper } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { useEffect, useRef, useState } from 'react';

import { SortableCarouselCtrlItem } from './SortableCarouselCtrlItem';
import { SoratbleGrid } from './SortableGrid';
interface ISortableContainer {
  nodeView: IHasChildrenView;
  nodeId: string;
  carouselNode: IChildrenViewEnum;
  setCarouselNode: (node: IChildrenViewEnum) => void;
}

export const SoratbleCarouselCtrlContainer = ({
  nodeId,
  carouselNode,
  setCarouselNode,
}: ISortableContainer) => {
  const { t } = usePage();
  const [isDisable, setIsDisable] = useState<boolean>(false);

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
  const isHistoryViewer = useHistoryViewerMatch();

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over?.id) return;

    if (active.id !== over.id && carouselNode) {
      const oldIndex = carouselNode.findIndex((item) => item.id === active.id);
      const newIndex = carouselNode.findIndex((item) => item.id === over.id);
      const sortedCarousel = arrayMove(carouselNode, oldIndex, newIndex);
      setCarouselNode(sortedCarousel);

      // (document.activeElement as HTMLElement).blur();
    }
    // (document.activeElement as HTMLElement).blur();
  };

  const handleDuplicationCard = (id: string, node: IChildrenViewEnum) => {
    const target = node.find((item) => item.id === id);
    if (target && !isDisable) {
      const duplicated = nodeHelper.cloneView(target);
      setCarouselNode([...node, duplicated]);
    }
  };

  const handleDeleteCard = (id: string, node: IChildrenViewEnum) => {
    const target = node.findIndex((item) => item.id === id);

    if (target >= 0) {
      setCarouselNode(node.filter((item) => item.id !== id));
    }
  };

  const contextMenu: IPopperItem<{
    action: ((id: string, node: IChildrenViewEnum) => void) | null;
  }>[] = [
    {
      id: 'duplicate-carousel',
      name: 'Duplication',
      type: 'icon-front',
      icon: !isDisable ? icCardDuplication : icCardDuplicationDisabled,
      data: {
        action: !isDisable ? handleDuplicationCard : null,
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

  useEffect(() => {
    if (carouselNode.length >= 10) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [carouselNode, isDisable]);

  return (
    <DndContext
      onDragEnd={(e) => handleDragEnd(e)}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={(e) => {
        // (document.activeElement as HTMLElement).blur();
      }}
      // modifiers={[restrictToParentElement]}
    >
      {carouselNode && (
        <SortableContext items={carouselNode}>
          <SoratbleGrid columns={5}>
            {carouselNode?.map((item, i: number) => (
              <Popper
                className="onContextMenu"
                placement="right"
                offset={[0, -100]}
                popup
                popupList
                popperItems={contextMenu}
                onChange={(m) => {
                  console.log('@m.data?.action outside: ', m.data?.action);
                  console.log('@m.data?.action?.name outside:', m.data?.action?.name);
                  console.log('@m.data.type', typeof m.data?.action?.name);
                  if (isDisable && !m.data?.action?.name) {
                    console.log('@m.data?.action1', m.data?.action, m.data?.action);
                    console.log('@m.data?.action?.name1', m.data?.action?.name);
                    lunaToast.error(
                      t(`CAROUSEL_POPUP_SAVE_SYSTEM_ALERT_CHATBUBBLE_LIMIT`),
                    );
                    return;
                  } else if (
                    isDisable &&
                    m.data?.action?.name.match('handleDuplicationCard')
                  ) {
                    console.log('@m.data?.action2', m.data?.action, m.data.action.name);
                    console.log('@m.data?.action?.name2', m.data?.action?.name);
                    lunaToast.error(
                      t(`CAROUSEL_POPUP_SAVE_SYSTEM_ALERT_CHATBUBBLE_LIMIT`),
                    );
                    return;
                  } else if (m.data?.action?.name.match('handleDeleteCard')) {
                    console.log('@m.data?.action3', m.data?.action, m.data.action.name);
                    console.log('@m.data?.action?.name3', m.data?.action?.name);
                    m.data?.action?.(item.id, carouselNode);
                  } else {
                    console.log(
                      '@m.data?.action4 ',
                      m.data?.action,
                      m.data?.action?.name,
                    );
                    console.log('@m.data?.action?.name4', m.data?.action?.name);
                    m.data?.action?.(item.id, carouselNode);
                  }
                }}
                key={i}
                disabled={isHistoryViewer}
              >
                <div
                  onContextMenu={(e) => {
                    e.preventDefault();
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
