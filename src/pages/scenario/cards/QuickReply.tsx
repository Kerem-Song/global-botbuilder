import { Button, Card } from '@components';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
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
            <div key={`${nodeId}-quickReply-${i}`}>
              <Button className="btnQuickRelply">
                {item.label ? item.label : 'Quick Reply'}
              </Button>
              <div className="nextNodeWrapper">
                <NextNodeButton ctrlId={item.id} nodeId={nodeId} type="blue" index={i} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
