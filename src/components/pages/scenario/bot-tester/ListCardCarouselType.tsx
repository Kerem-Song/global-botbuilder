import { Divider, Space } from '@components';
import { IListTypeCard } from '@models';
import classNames from 'classnames';
import { FC, SyntheticEvent } from 'react';
import MultiClamp from 'react-multi-clamp';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface IListCardCarouselTypeProps {
  item: IListTypeCard;
  handleImgOnError: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const ListCardCarouselType: FC<IListCardCarouselTypeProps> = ({
  item,
  handleImgOnError,
}) => {
  const isSquareImage = item.image?.imageAspectRatio === 1;

  return (
    <div
      className={classNames('listCard', {
        listCardCarouselSquareImageCard: isSquareImage,
        listCardCarouselRectangleImageCard: !isSquareImage,
      })}
    >
      {item.header && (
        <div className="header">
          <span>
            <MultiClamp clamp={1} ellipsis={'...'}>
              {item.header.substring(0, 40)}
            </MultiClamp>
          </span>
        </div>
      )}
      {item.image ? (
        <img
          className={isSquareImage ? 'listCardImg_square' : 'listCardImg_rectangle'}
          src={item.image?.imageUrl}
          alt="img"
          onError={(e) => {
            handleImgOnError(e);
          }}
        />
      ) : (
        <></>
      )}
      <div className="listCardContentsWrap">
        <div
          className={classNames('listCardContents', {
            listCardCarouselSqureImageContents: isSquareImage,
            listCardCarouselRectangleImageContents: !isSquareImage,
          })}
        >
          <div className="listContentsInfo">
            {item.items.map((x, i) => {
              return (
                <div key={i} className="listCardContent">
                  <div className="cardList">
                    <div className="listInfo">
                      <div className="infoTitle">
                        <MultiClamp clamp={2} ellipsis={'...'}>
                          {x.title?.substring(0, 60)}
                        </MultiClamp>
                      </div>
                      <div className="infoDesc">
                        <MultiClamp clamp={1} ellipsis={'...'}>
                          {x.description?.substring(0, 40)}
                        </MultiClamp>
                      </div>
                    </div>
                    <div className="listImg">
                      <img
                        src={x.image?.imageUrl}
                        alt="img"
                        onError={(e) => {
                          handleImgOnError(e);
                        }}
                      />
                    </div>
                  </div>
                  {item.items.length - 1 === i ? <Space /> : <Divider />}
                </div>
              );
            })}
          </div>
          <div>
            {item.image?.imageUrl && item.buttons.length > 0 ? (
              <div className={isSquareImage ? 'squareImageBtn' : 'rectangleImageBtn'}>
                {item.buttons?.map((v, i) => {
                  return <TesterMessagesItemButton key={i} item={v} />;
                })}
              </div>
            ) : (
              <div className="rectangleImageBtn">
                {item.buttons?.map((v, i) => {
                  return <TesterMessagesItemButton key={i} item={v} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
