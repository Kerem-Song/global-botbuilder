import { Card } from '@components/data-display';
import { INode } from '@models';
import { ITextView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { FC } from 'react';

export interface ITextNodeProps {
  node: INode;
}

export const TextNode: FC<ITextNodeProps> = ({ node }) => {
  const view = node.view as ITextView;
  return (
    <Card>
      <div
        className={classNames('description', {
          none: view.text === undefined,
          empty: view.text === '',
        })}
      >
        {view.text ? <p>{view.text}</p> : <p>Enter Content</p>}
      </div>
    </Card>
  );
};
