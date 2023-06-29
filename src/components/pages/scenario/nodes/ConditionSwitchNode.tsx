import { Card } from '@components';
import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { useI18n } from '@hooks';
import { ConditionJoin } from '@models';
import { IHasNode } from '@models/interfaces/IHasNode';
import { IConditionView } from '@models/interfaces/res/IGetFlowRes';
import { FALSE_SUFFIX, NODE_PREFIX, TRUE_SUFFIX } from '@modules';
import { FC, useRef } from 'react';

export const ConditionSwitchNode: FC<IHasNode> = ({ node }) => {
  const { getConditionOperatorLabel } = useI18n();
  const view: IConditionView = node.view as IConditionView;
  const conditionNodeRef = useRef<HTMLDivElement>(null);
  const conditionNodeHeight = conditionNodeRef.current?.getBoundingClientRect().y;
  return (
    <Card>
      <div className="countConditionWrapper conditionCaseWrapper" ref={conditionNodeRef}>
        {view.items?.map((item, i) => {
          return (
            <div key={i}>
              <p className="conditionCase">
                Case
                {item.op1} {item.operator ? getConditionOperatorLabel(item.operator) : ''}{' '}
                {item.op2 || '{{ }}'}
              </p>
              <NextNodeButton
                ctrlId={`${node.id}${TRUE_SUFFIX}${i}`}
                nodeId={`${NODE_PREFIX}${node.id}`}
                type="green"
                offset={i * 65 + 70}
              />
            </div>
          );
        })}
      </div>

      {/* {view.items?.map((item, i) => {
        return (
          <div key={i}>
            <NextNodeButton
              ctrlId={`${node.id}${TRUE_SUFFIX}`}
              nodeId={`${NODE_PREFIX}${node.id}`}
              type="green"
              offset={i * 50}
            />
          </div>
        );
      })} */}

      <NextNodeButton
        ctrlId={`${node.id}${FALSE_SUFFIX}`}
        nodeId={`${NODE_PREFIX}${node.id}`}
        type="red"
        // offset={conditionNodeHeight ? conditionNodeHeight - 20 : 80}
      />
    </Card>
  );
};
