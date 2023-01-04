import { Button, Input, Space, Switch } from '@components';
import { useRootState } from '@hooks';
import { IScenarioModel } from '@models';
import { setSelectedScenario } from '@store/botbuilderSlice';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useScenarioClient } from '../../../hooks/client/scenarioClient';
import { ScenarioItem } from './ScenarioItem';

export const ScenarioManagement: FC<{ scenarios?: IScenarioModel[] }> = ({
  scenarios,
}) => {
  const dispatch = useDispatch();
  const { scenarioSaveAsync } = useScenarioClient();

  const basicScenarioList = [{ name: 'Help (Fallback)' }];

  const handleSwitch = () => {
    console.log('switch toggle');
  };

  useEffect(() => {
    dispatch(setSelectedScenario(scenarios?.[0]));
  }, [scenarios]);

  const handleNewScenario = async () => {
    await scenarioSaveAsync(`scenario ${scenarios?.length || 1}`);
  };

  return (
    <div className="scenarioTabWrapper">
      <div className="openedScenarioOption">
        <p>활성 시나리오만 보기</p>
        <Switch onChange={handleSwitch} />
      </div>

      <div className="basicScenarioWrapper">
        <p>기본 제공 시나리오</p>
        <div className="basicScenarioList">
          {basicScenarioList.map((item, i) => {
            return (
              <div key={i} className="basicScenario">
                <span>{item.name}</span>
                <Switch onChange={handleSwitch} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="newScenarioBtn">
        <Button block type="primary" onClick={handleNewScenario}>
          + 새 시나리오
        </Button>
      </div>

      <div className="scenarioListWrapper">
        <Space gap="small" direction="vertical">
          {scenarios ? (
            scenarios?.map((item) => <ScenarioItem key={item.id} item={item} />)
          ) : (
            <div className="noResults"></div>
          )}
        </Space>
      </div>
      <div className="search">
        <Input placeholder="시나리오명을 입력해주세요. " search />
      </div>
    </div>
  );
};
