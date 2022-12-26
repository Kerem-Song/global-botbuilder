import { Button, Card } from '@components';
import { ICondition } from '@models';
import { FC } from 'react';

interface Condition {
  nodeId: string;
  cards: ICondition[];
}
export const Condition: FC<Condition> = ({ nodeId, cards }) => {
  return (
    <Card>
      {cards?.map((item, i) => {
        return (
          <div className="countConditionWrapper" key={`${nodeId}-condition-${i}`}>
            <p>
              if &#123;&#123;{item.userInput}&#125;&#125;
              {item.condition}
              {item.comparativeValue}
              {item.variableChoice}
              {item.logicalOperator}
              {item.connectedMessage}
              {item.elseMessage}
            </p>
          </div>
        );
      })}
      <Button
        className="nextNode green"
        shape="ghost"
        onClick={() => console.log('greenNode')}
      ></Button>
      <Button
        className="nextNode red"
        shape="ghost"
        onClick={() => console.log('redNode')}
      ></Button>
    </Card>
  );
};
