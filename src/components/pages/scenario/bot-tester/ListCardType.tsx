import { Divider, Space } from '@components';
import { IListTypeCard, ITesterDebugMeta } from '@models';
import { FC, SyntheticEvent } from 'react';
import MultiClamp from 'react-multi-clamp';

import { TesterMessagesItemButton } from './TesterMessagesItemButton';

export interface IListCardTypeProps {
  item: IListTypeCard;
  onClick: (debugMeta?: ITesterDebugMeta) => void;
  handleImgOnError: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const ListCardType: FC<IListCardTypeProps> = ({
  item,
  onClick,
  handleImgOnError,
}) => {
  const isSquareImage = item.image?.imageAspectRatio === 1;
  return (
    <div
      className="listCardContainer"
      role="presentation"
      onClick={() => onClick(item.debugMeta)}
    >
      <div className="listCard">
        {item.header && (
          <div className="header">
            <MultiClamp clamp={1} ellipsis={'...'}>
              {item.header.substring(0, 40)}
            </MultiClamp>
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
          <div className="listCardContents">
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
