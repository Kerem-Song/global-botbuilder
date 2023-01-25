import { Button, Card } from '@components';
import { SortableButtonCtrlContainer } from '@components/data-display/SortableButtonCtrlContainer';
import { INode } from '@models';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';

interface AnswerNodeProps {
  nodeId: string;
  node: INode;
}
export const AnswerNode: FC<AnswerNodeProps> = ({ nodeId, node }) => {
  const view = node.view as IAnswerView;
  console.log(view);
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
