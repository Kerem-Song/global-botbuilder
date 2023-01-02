import { Card } from '@components/data-display/Card';
import { Carousel } from '@components/data-display/Carousel';
import { SortableButtonContainer } from '@components/data-display/SortableButtonContainer';
import { SortableListContainer } from '@components/data-display/SortableListContainer';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { IListCard } from 'src/models/interfaces/ICard';

interface ListCard {
  nodeId: string;
  cards: IListCard[];
}

export const ListCard: FC<ListCard> = ({ nodeId, cards }) => {
  const [squareMode, setSquareMode] = useState<boolean>(false);
  const [headerThumbnail, setHeaderThumbnail] = useState<boolean>(false);
  const thumbnailClass = classNames('thumbnail', {
    square: squareMode,
    off: headerThumbnail,
  });

  return (
    <Carousel nodeId={nodeId}>
      {cards.map((list, i) => (
        <Card key={`card-${i}`} hoverable onClick={() => console.log('card click')}>
          {list.header ? (
            <div className={classNames('title list', { empty: !list.header?.title })}>
              {list.header?.title ? <p>{list.header.title}</p> : <p>Enter Head Title</p>}
            </div>
          ) : null}
          {list.thumbnail ? (
            <div className={thumbnailClass}>
              {list.thumbnail?.imageUrl ? (
                <img src={list.thumbnail?.imageUrl} alt="thumbnailImage" />
              ) : (
                <div className="skeleton"></div>
              )}
            </div>
          ) : null}

          {list.items && list.items.length < 6 ? (
            // list.items?.map((item, i) => (
            //     <div className={'listItems node-draggable-ignore'} key={i}>
            //       <Row justify="flex-start" align="center">
            //         <Col span={6}>
            //           {item.thumbnail?.imageUrl ? (
            //             <img src={item.thumbnail.imageUrl} alt="itemThumbnail" />
            //           ) : (
            //             <div className="listItemThumbnailSkeleton"></div>
            //           )}
            //         </Col>
            //         <Col span={18} className="listItemsContent">
            //           {item.title ? (
            //             <p className="title">{item.title}</p>
            //           ) : (
            //             <p className="title empty">Enter Title</p>
            //           )}
            //           {item.description ? (
            //             <p className="description">{item.description}</p>
            //           ) : (
            //             <p className="description empty">Enter Content</p>
            //           )}
            //         </Col>
            //       </Row>
            //     </div>
            //   ))
            <div className={'node-draggable-ignore'}>
              {list.items && <SortableListContainer listItems={list.items} />}
            </div>
          ) : null}
          <div className="buttonWrapper list node-draggable-ignore">
            {list.buttons && (
              <SortableButtonContainer cardButtons={list.buttons} cardId={i} />
            )}
          </div>
        </Card>
      ))}
    </Carousel>
  );
};
