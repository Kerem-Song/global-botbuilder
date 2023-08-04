import { ITesterDebugMeta, ITextCard } from '@models';
import { FC } from 'react';

export interface ITextCardTypeProps {
  item: ITextCard;
  onClick: (debugMeta?: ITesterDebugMeta) => void;
}

export const TextCardType: FC<ITextCardTypeProps> = ({ item, onClick }) => {
  return (
    <>
      {item.isMe ? (
        <div className="send">
          <div className="sendMessage">{item.value}</div>
        </div>
      ) : (
        <div
          role="presentation"
          className="reply"
          onClick={() => onClick(item.debugMeta)}
        >
          <div className="replyMessage">{item.value}</div>
        </div>
      )}
    </>
  );
};
