import { Col, Row } from '@components';
import { Card } from '@components/data-display/Card';
import { Carousel } from '@components/data-display/Carousel';
import { SortableButtons } from '@components/data-display/SortableButtons';
import { Button } from '@components/general/Button';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import classNames from 'classnames';
import { FC, useState } from 'react';

import { IBasicCard, IButtonType } from '../../../models/interfaces/ICard';
interface BasicCard {
  nodeId: string;
  cards: IBasicCard[];
}

export const BasicCard: FC<BasicCard> = ({ nodeId, cards }) => {
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: squareMode,
    textCard: false,
  });

  return (
    <Carousel nodeId={nodeId}>
      {cards.map((item, i) => (
        <Card key={`card-${i}`}>
          {item.thumbnail ? (
            <div
              className={classNames(
                'thumbnail',
                item.title === undefined &&
                  item.buttons === undefined &&
                  item.description === undefined
                  ? 'round'
                  : '',
              )}
            >
              {item.thumbnail?.imageUrl ? (
                <img src={item.thumbnail?.imageUrl} alt="thumbnailImage" />
              ) : (
                <div className="skeleton"></div>
              )}
            </div>
          ) : (
            <div className={classNames(thumbnailClass, { textCard: true })}></div>
          )}

          <div
            className={classNames(
              'title',
              item.title ? '' : item.title === undefined ? 'none' : 'empty',
            )}
          >
            {item.title ? <p>{item.title}</p> : <p>Enter Title</p>}
          </div>

          <div
            className={classNames(
              'description',
              item.description ? '' : item.description === undefined ? 'none' : 'empty',
            )}
          >
            {item.description ? <p>{item.description}</p> : <p>Enter Content</p>}
          </div>

          <div className="buttonWrapper node-draggable-ignore">
            {/* {item.buttons?.map((button, j) => {
              return (
                <Row key={`card-${i}-button-${j}`}>
                  <Col span={23}>
                    <Button key={`card-${i}-button-${j}`}>{button.label}</Button>
                  </Col>
                  <Col span={1} className="nextNodeWrapper">
                    <Button
                      key={`card-${i}-button-${j}-nodeButton-${j}`}
                      className="nextNode blue"
                      shape="ghost"
                      onClick={() => console.log('blueNode')}
                    ></Button>
                  </Col>
                </Row>
              );
            })} */}
            {item.buttons && <SortableButtons cardButtons={item.buttons} cardId={i} />}
          </div>
        </Card>
      ))}
    </Carousel>
  );
};
