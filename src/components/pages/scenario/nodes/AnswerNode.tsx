import { Button, Card } from '@components';
import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { SortableButtonCtrlContainer } from '@components/pages/scenario/SortableButtonCtrlContainer';
import { INode } from '@models';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';

interface AnswerNodeProps {
  nodeId: string;
  node: INode;
}
export const AnswerNode: FC<AnswerNodeProps> = ({ nodeId, node }) => {
  const view = node.view as IAnswerView;

  return (
    <Card>
      <div className="quickReplyWrapper node-draggable-ignore">
        {view.utteranceParam ? (
          <>
            <Button key={`${nodeId}-quickReply-answer`} className="btnQuickRelply">
              {view.utteranceParam}
            </Button>
            <NextNodeButton
              ctrlId={`${nodeId}`}
              nodeId={`${NODE_PREFIX}${nodeId}`}
              type="blue"
              offset={60}
            />
          </>
        ) : undefined}
        <SortableButtonCtrlContainer
          isQuicks
          buttonList={view.quicks}
          nodeId={`${NODE_PREFIX}${nodeId}`}
          nextNodeOffset={view.utteranceParam ? 102 : 66}
        />
      </div>
    </Card>
  );
};
