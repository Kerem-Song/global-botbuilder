import { Button, Card } from '@components';
import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { SortableButtonCtrlContainer } from '@components/pages/scenario/SortableButtonCtrlContainer';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';

export const AnswerNode: FC<IHasNode> = ({ node }) => {
  const view = node.view as IAnswerView;
  return (
    <Card>
      <div className="quickReplyWrapper node-draggable-ignore">
        {view.utteranceParam ? (
          <>
            <Button key={`${node.id}-quickReply-answer`} className="btnQuickRelply">
              <span>
                {`{{`}
                <span style={{ color: '#4478FF' }}>{view.utteranceParam}</span>
                {`}}`}
              </span>
            </Button>
            <NextNodeButton
              ctrlId={`${node.id}`}
              nodeId={`${NODE_PREFIX}${node.id}`}
              type="blue"
              offset={60}
            />
          </>
        ) : undefined}
        <SortableButtonCtrlContainer
          isQuicks
          buttonList={view.quicks}
          nodeId={`${NODE_PREFIX}${node.id}`}
          nextNodeOffset={view.utteranceParam ? 102 : 66}
        />
      </div>
    </Card>
  );
};
