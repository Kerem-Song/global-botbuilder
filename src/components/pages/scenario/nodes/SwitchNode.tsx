import { Card } from '@components';
import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { useI18n } from '@hooks';
import { IHasNode } from '@models/interfaces/IHasNode';
import { ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import { CONDITION_SUFFIX, DEFAULT_SUFFIX, NODE_PREFIX } from '@modules';
import { FC, useRef } from 'react';

export const SwitchNode: FC<IHasNode> = ({ node }) => {
  const { getConditionOperatorLabel } = useI18n();
  const view = node.view as ISwitchView;
  const conditionNodeRef = useRef<HTMLDivElement>(null);

  return (
    <Card>
      <div className="countConditionWrapper conditionCaseWrapper" ref={conditionNodeRef}>
        {view.conditions?.map((condition, i) => (
          <div key={condition.id}>
            {condition.items?.map((item, j) => (
              <div key={j}>
                <p className="conditionCase">
                  Case
                  {item.op1}{' '}
                  {item.operator ? getConditionOperatorLabel(item.operator) : ''}{' '}
                  {item.op2 || '{{ }}'}
                </p>
                <NextNodeButton
                  ctrlId={`${node.id}${CONDITION_SUFFIX}${condition.id}`}
                  nodeId={`${NODE_PREFIX}${node.id}`}
                  type="green"
                  offset={i * 25 + 60}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <NextNodeButton
        ctrlId={`${node.id}${DEFAULT_SUFFIX}`}
        nodeId={`${NODE_PREFIX}${node.id}`}
        type="red"
        // offset={conditionNodeHeight ? conditionNodeHeight - 20 : 80}
      />
    </Card>
  );
};
