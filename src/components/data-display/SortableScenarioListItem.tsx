import { Col, Row } from '@components/layout';
import { ScenarioItem } from '@components/pages/scenario/ScenarioItem';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IScenarioModel, ISortableListItem } from '@models';

export const SortableScenarioListItem = ({ item }: { item: IScenarioModel }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ScenarioItem item={item} />
    </div>
  );
};
