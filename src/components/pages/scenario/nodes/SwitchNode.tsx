import { Card } from '@components';
import { NextNodeButton } from '@components/pages/scenario/NextNodeButton';
import { useI18n, useRootState } from '@hooks';
import { ConditionJoin } from '@models';
import { IHasNode } from '@models/interfaces/IHasNode';
import { ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import { CONDITION_SUFFIX, DEFAULT_SUFFIX, NODE_PREFIX } from '@modules';
import { FC, useRef } from 'react';
import MultiClamp from 'react-multi-clamp';

export const SwitchNode: FC<IHasNode> = ({ node }) => {
  const { getConditionOperatorLabel } = useI18n();
  const view = node.view as ISwitchView;
  const conditionNodeRef = useRef<HTMLDivElement>(null);
  const carouselIndexObj = useRootState((state) => state.botBuilderReducer.carouselIndex);
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const selectedNode = nodes.find((x) => x.id === selected);
  const index = carouselIndexObj[`${selectedNode?.view?.id}`];
  const changeConditionJoin = (condition?: ConditionJoin) => {
    if (condition === ConditionJoin.And) {
      return ' And ';
    } else if (condition === ConditionJoin.Or) {
      return ' Or ';
    } else {
      return '';
    }
  };
  return (
    <Card>
      <div className="conditionSwitchWrapper" ref={conditionNodeRef}>
        {view.conditions?.map((condition, i) => (
          <div
            key={condition.id}
            className="conditionCase"
            style={
              view.id === selectedNode?.view?.id && index === i
                ? {
                    backgroundColor: '#ecf2ff',
                    borderColor: '#a1bbff',
                  }
                : {}
            }
          >
            <span className="caseLabel">
              {/* {i + 1}:  */}
              if{' '}
            </span>
            {/* <MultiClamp clamp={1} ellipsis={'...'}>
              {condition.items?.[0].op1}{' '}
              {condition.items?.[0].operator
                ? getConditionOperatorLabel(true, condition.items?.[0].operator)
                : ''}{' '}
              {condition.items?.[0].op2 || '{{ }}'}
            </MultiClamp> */}
            <p>
              {condition.items?.map((item, i) => (
                <span key={i}>
                  {item.op1}{' '}
                  {item.operator ? getConditionOperatorLabel(true, item.operator) : ''}{' '}
                  {item.op2 || '{{ }}'}
                  {condition?.items &&
                    condition.items.length > 1 &&
                    changeConditionJoin(condition.join)}
                </span>
              ))}
            </p>
            <NextNodeButton
              ctrlId={`${node.id}${CONDITION_SUFFIX}${condition.id}`}
              nodeId={`${NODE_PREFIX}${node.id}`}
              type="green"
              offset={i * 40 + 57}
            />
          </div>
        ))}
        <div className="conditionCase">
          <span className="caseLabel">else</span>
          <NextNodeButton
            ctrlId={`${node.id}${DEFAULT_SUFFIX}`}
            nodeId={`${NODE_PREFIX}${node.id}`}
            type="red"
            // offset={conditionNodeHeight ? conditionNodeHeight - 20 : 80}
          />
        </div>
      </div>
    </Card>
  );
};
