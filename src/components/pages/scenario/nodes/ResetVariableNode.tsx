import { Card } from '@components';
import { usePage } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IResetVariableCardView } from '@models/interfaces/res/IGetFlowRes';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

export const ResetVariableNode: FC<IHasNode> = ({ node }) => {
  const { t } = usePage();
  const view: IResetVariableCardView = node.view as IResetVariableCardView;

  return (
    <Card>
      <div className="countConditionWrapper">
        <div className="dataCardDesc">
          <p>
            {t(`RESET_VARIABLE_NODE_SET`)} :{' '}
            {view.resetAll === 'all'
              ? t(`RESET_VARIABLE_NODE_RESET_ALL`)
              : t(`RESET_VARIABLE_NODE_RESET_SELECT`)}
          </p>
          {view.parameters?.map((item, i) => (
            // <MultiClamp clamp={1} ellipsis={'...'} key={item.key}>
            <MultiClamp clamp={1} ellipsis={'...'} key={i}>
              {item.name}
            </MultiClamp>
          ))}
        </div>
      </div>
    </Card>
  );
};
