import { Card } from '@components';
import { usePage } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IParameterClearCardView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

import { NextNodeButton } from '../NextNodeButton';

export const ParameterClearNode: FC<IHasNode> = ({ node }) => {
  const { t } = usePage();
  const view: IParameterClearCardView = node.view as IParameterClearCardView;
  const lineClamp = 16;
  return (
    <Card>
      <div className="countConditionWrapper parameterClear">
        <div className="dataCardDesc">
          <p>
            {t(`PARAMETER_CLEAR_NODE_SET`)} :{' '}
            {view.isAll === true
              ? t(`PARAMETER_CLEAR_NODE_RESET_ALL`)
              : t(`PARAMETER_CLEAR_NODE_RESET_SELECT`)}
          </p>
          <div className="parameterClearVariables">
            {view.parameters?.map((item, i) => (
              // <MultiClamp clamp={1} ellipsis={'...'} key={item.key}>
              <MultiClamp clamp={1} ellipsis={'...'} key={i}>
                {item.name}
              </MultiClamp>
            ))}
          </div>
          {view.parameters && view.parameters.length > lineClamp && <p>{'...'}</p>}
        </div>
        <NextNodeButton
          ctrlId={`${node.id}`}
          nodeId={`${NODE_PREFIX}${node.id}`}
          type="blue"
        />
      </div>
    </Card>
  );
};
