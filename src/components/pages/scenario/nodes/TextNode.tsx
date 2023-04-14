import { Card } from '@components/data-display';
import { IHasNode } from '@models/interfaces/IHasNode';
import { ITextView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

export const TextNode: FC<IHasNode> = ({ node }) => {
  const view = node.view as ITextView;
  return (
    <Card>
      <div
        className={classNames('description', {
          none: view.text === undefined,
          empty: view.text === '',
        })}
      >
        {view.text ? (
          <span style={{ whiteSpace: 'pre-line' }}>
            <MultiClamp clamp={2}>{view.text}</MultiClamp>
          </span>
        ) : (
          <p>Enter Content</p>
        )}
      </div>
    </Card>
  );
};
