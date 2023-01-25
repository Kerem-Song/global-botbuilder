import { Card } from '@components';
import { SortableButtonContainer } from '@components/data-display/SortableButtonContainer';
import { SortableQuickButtonContainer } from '@components/data-display/SortableQuickButtonContainer';
import { INode } from '@models';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

interface QuickReply {
  nodeId: string;
  cardId: number;
  node: INode;
}
export const QuickReply: FC<QuickReply> = ({ nodeId, node, cardId }) => {
  const view = node.view as IAnswerView;
  console.log(view);
  return (
    <Card>
      <div className="quickReplyWrapper node-draggable-ignore">
        <SortableQuickButtonContainer
          quickButtons={view.quicks}
          cardId={cardId}
          nodeId={nodeId}
        />
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
