import { Row } from '@components';
import { Button } from '@components/general';
import { Col } from '@components/layout';
import { UniqueIdentifier } from '@dnd-kit/core';
import { IButtonType } from '@models';
import React, { CSSProperties, forwardRef, useRef } from 'react';

interface ISortableButtonItemProps {
  id?: UniqueIdentifier;
  item?: IButtonType;
  style?: {
    transform: string | undefined;
    transition: string | undefined;
  };
}

export const SortableButtonItemTest = forwardRef(
  (
    { id, item, ...props }: ISortableButtonItemProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div ref={ref} {...props}>
        <Row key={`card-${item?.id}-button-${item?.id}`}>
          <Col span={23}>
            <Button key={`card-${item?.id}-button-${item?.id}`}>{item?.label}</Button>
          </Col>
          <Col span={1} className="nextNodeWrapper">
            <Button
              key={`card-${item?.id}-button-${item?.id}-nodeButton-${item?.id}`}
              className="nextNode blue"
              shape="ghost"
              onClick={() => console.log('blueNode')}
            ></Button>
          </Col>
        </Row>
      </div>
    );
  },
);

SortableButtonItemTest.displayName = 'SortableButtomItemTest';
