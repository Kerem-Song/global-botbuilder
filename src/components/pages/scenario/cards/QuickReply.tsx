import { Button, Card } from '@components';
import { SortableButtonContainer } from '@components/data-display/SortableButtonContainer';
import { SortableButtonCtrlContainer } from '@components/data-display/SortableButtonCtrlContainer';
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
  return (
    <Card>
      <div className="quickReplyWrapper node-draggable-ignore">
        {view.utteranceParam ? (
          <Button key={`${nodeId}-quickReply-answer`} className="btnQuickRelply">
            {`{{${view.utteranceParam || ''}}}`}
          </Button>
        ) : undefined}
        <SortableButtonCtrlContainer buttonList={view.quicks} nodeId={nodeId} />
      </div>
    </Card>
  );
};
