import { Button, Card } from '@components';
import { NextNodeButton } from '@components/data-display/NextNodeButton';
import { SortableButtonContainer } from '@components/data-display/SortableButtonContainer';
import { IAnswerNode } from '@models';
import { FC } from 'react';

interface QuickReply {
  nodeId: string;
  cardId: number;
  cards: IAnswerNode[];
}
export const QuickReply: FC<QuickReply> = ({ nodeId, cards, cardId }) => {
  return (
    <Card>
      <div className="quickReplyWrapper node-draggable-ignore">
        <SortableButtonContainer cardButtons={cards} cardId={cardId} nodeId={nodeId} />
        {/* {cards?.map((item, i) => {
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
        })} */}
      </div>
    </Card>
  );
};
