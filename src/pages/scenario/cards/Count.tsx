import { Button, Card } from '@components';
import { ICount } from '@models';
import { FC } from 'react';

interface Count {
  nodeId: string;
  cards: ICount[];
}
export const Count: FC<Count> = ({ nodeId, cards }) => {
  return (
    <Card>
      {cards.map((item, i) => {
        return (
          <div className="countConditionWrapper" key={`${nodeId}-count-${i}`}>
            <p>{item.requestionNum}</p>
          </div>
        );
      })}
      <Button
        className="nextNode green"
        shape="ghost"
        onClick={() => console.log('greenNode')}
      ></Button>
      <Button
        className="nextNode yellow"
        shape="ghost"
        onClick={() => console.log('greenNode')}
      ></Button>
    </Card>
  );
};
