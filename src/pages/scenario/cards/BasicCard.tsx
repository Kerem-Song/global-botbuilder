import { Card } from '@components/data-display/Card';
import { Carousel } from '@components/data-display/Carousel';
import { Button } from '@components/general/Button';
import classNames from 'classnames';
import { FC, useState } from 'react';

import { IBasicCard } from '../../../models/interfaces/ICard';

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
        <Card key={i} onClick={() => console.log('card click')}>
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

          <div className="buttonWrapper">
            {item.buttons?.map((button, i) => {
              return (
                <>
                  <Button key={i}>{button.label}</Button>
                </>
              );
            })}
          </div>
        </Card>
      ))}
    </Carousel>
  );
};
