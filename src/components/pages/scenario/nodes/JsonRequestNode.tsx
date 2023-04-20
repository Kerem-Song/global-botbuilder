import { Card } from '@components';
import { usePage } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { FC } from 'react';
import MultiClamp from 'react-multi-clamp';

import { NextNodeButton } from '../NextNodeButton';

export const JsonRequestNode: FC<IHasNode> = ({ node }) => {
  const view: IJsonRequestView = node.view as IJsonRequestView;
  const { t } = usePage();
  console.log('@view jsonreqNode', node);
  console.log('@@@');
  return (
    <Card>
      <div className="method">{view.method}</div>
      <div className="countConditionWrapper">
        {view.url ? (
          <span style={{ whiteSpace: 'pre-line' }}>
            <MultiClamp clamp={2} ellipsis={'...'}>
              {view.url}
            </MultiClamp>
          </span>
        ) : (
          <span style={{ whiteSpace: 'pre-line', color: '#929292' }}>
            <MultiClamp clamp={2} ellipsis={'...'}>
              {t(`API_REQUEST_PLACEHOLDLER`)}
            </MultiClamp>
          </span>
        )}

        <NextNodeButton
          ctrlId={`${node.id}`}
          nodeId={`${NODE_PREFIX}${node.id}`}
          type="blue"
        />
      </div>
    </Card>
  );
};
