import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { IButtonType } from '@models';
import { arrayMoveImmutable } from 'array-move';
import React, { useState } from 'react';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
  SortEvent,
  SortEventWithTag,
} from 'react-sortable-hoc';

interface ISortableButtonsProps {
  children?: React.ReactNode;
  item: IButtonType[];
}
export const SortableButtons = ({ item }: ISortableButtonsProps) => {
  const SortableItem: React.ComponentClass<
    SortableElementProps & { value: IButtonType },
    any
  > = SortableElement(({ value }: { value: IButtonType }) => (
    <Row>
      <Col span={23}>
        <Button>{value.label}</Button>
      </Col>
      <Col span={1} className="nextNodeWrapper">
        <Button
          className="nextNode blue"
          shape="ghost"
          onClick={() => console.log('blueNode')}
        ></Button>
      </Col>
    </Row>
  ));

  const SortableList: React.ComponentClass<
    SortableContainerProps & { items: IButtonType[] },
    any
  > = SortableContainer(({ items }: { items: IButtonType[] }) => {
    return (
      <div className="buttonWrapper node-draggable-ignore">
        {items.map((item: IButtonType, index: number) => (
          <SortableItem key={`item-${index}`} index={index} value={item} />
        ))}
      </div>
    );
  });

  const shouldCancelStart = (e: SortEvent | SortEventWithTag) => {
    let target = e.currentTarget;
    if (!target) {
      target = e.currentTarget;
      return true;
    }
    if (target.className === 'item') {
      console.log('Div button click here ');
      // perform you click opration here
      return false;
    }
    return true;
  };

  const [state, setState] = useState<IButtonType[]>([
    { label: 'Button 012', action: 'block' },
    { label: 'Button 023', action: 'block' },
    { label: 'Button 034', action: 'block' },
  ]);

  const [buttons, setButtons] = useState(item);

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }): void => {
    console.log('sortend func');

    setButtons(arrayMoveImmutable(buttons, oldIndex, newIndex));
    // setState(arrayMove(state, oldIndex, newIndex));
    // console.log('buttons set', buttons);
  };
  console.log('buttons :"', buttons);
  return (
    <SortableList
      onSortStart={() => console.log('sort start')}
      items={buttons}
      // onSortEnd={onSortEnd}
    />
  );
};
