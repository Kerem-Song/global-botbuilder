import { Button, Card } from '@components';
import { IAnswerNode } from '@models';
import { FC } from 'react';

interface QuickReply {
  nodeId: string;
  cards: IAnswerNode[];
}
export const QuickReply: FC<QuickReply> = ({ nodeId, cards }) => {
  return (
    <Card>
      <div className="quickReplyWrapper">
        {cards?.map((item, i) => {
          return (
            <Button key={`${nodeId}-quickReply-${i}`}>
              {item.label ? item.label : 'Quick Reply'}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};
