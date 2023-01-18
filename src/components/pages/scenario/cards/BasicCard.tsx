import { Card } from '@components/data-display/Card';
import { Carousel } from '@components/data-display/Carousel';
import { SortableButtonContainer } from '@components/data-display/SortableButtonContainer';
import classNames from 'classnames';
import { FC, useState } from 'react';

import { IBasicCardNode } from '../../../../models/interfaces/ICard';
interface BasicCard {
  nodeId: string;
  cards: IBasicCardNode[];
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
            className={classNames('title', {
              none: item.title === undefined,
              empty: item.title === '',
            })}
          >
            {item.title ? <p>{item.title}</p> : <p>Enter Title</p>}
          </div>

          <div
            className={classNames('description', {
              none: item.description === undefined,
              empty: item.description === '',
            })}
          >
            {item.description ? <p>{item.description}</p> : <p>Enter Content</p>}
          </div>

          <div className="buttonWrapper node-draggable-ignore">
            {item.buttons && (
              <SortableButtonContainer
                nodeId={nodeId}
                cardButtons={item.buttons}
                cardId={i}
              />
            )}
          </div>
        </Card>
      ))}
    </Carousel>
  );
};
