import { Card } from '@components/data-display/Card';
import { Carousel } from '@components/data-display/Carousel';
import { SortableButtonContainer } from '@components/data-display/SortableButtonContainer';
import { Button } from '@components/general';
import classNames from 'classnames';
import { FC, useState } from 'react';

import { IBasicCardNode } from '../../../../models/interfaces/ICard';
interface BasicCard {
  nodeId: string;
  cards: IBasicCardNode[];
  isCarousel?: boolean;
}

export const BasicCard: FC<BasicCard> = ({ nodeId, cards, isCarousel }) => {
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: squareMode,
    textCard: false,
  });

  const card = (item: IBasicCardNode, index: number) => {
    return (
      <Card>
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
              cardId={index}
            />
          )}
        </div>
      </Card>
    );
  };

  return (
    // <Carousel nodeId={nodeId} addCarousel={isCarousel}>
    //   {cards.map((item, i) => card(item, i))}
    // </Carousel>
    <></>
  );
};
