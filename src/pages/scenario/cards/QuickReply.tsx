import { Button, Card } from '@components';
import { IQuickReply } from '@models';
import { FC } from 'react';

interface QuickReply {
  nodeId: string;
  cards: IQuickReply[];
}
export const QuickReply: FC<QuickReply> = ({ nodeId, cards }) => {
  return (
    <Card>
      <div className="quickReplyWrapper">
        {cards?.map((item, i) => {
          return (
            <>
              <Button key={`${nodeId}-quickReply-${i}`}>
                {item.label ? item.label : 'Quick Reply'}
              </Button>
            </>
          );
        })}
      </div>
    </Card>
  );
};
