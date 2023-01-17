import { Button, Input, Space, Switch } from '@components';
import { SortableScenarioListContainer } from '@components/data-display/SortableScenarioListContainer';
import { useRootState } from '@hooks';
import { IScenarioModel } from '@models';
import { setSelectedScenario } from '@store/botbuilderSlice';
import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { useScenarioClient } from '../../../hooks/client/scenarioClient';

export const ScenarioManagement: FC<{
  scenarios?: IScenarioModel[];
  isFetching: boolean;
}> = ({ scenarios, isFetching }) => {
  const dispatch = useDispatch();
  const token = useRootState((state) => state.botBuilderReducer.token);
  const { scenarioCreateAsync } = useScenarioClient();

  const basicScenarioList = useRootState(
    (state) => state.botBuilderReducer.basicScenarios,
  );

  const handleSwitch = () => {
    console.log('switch toggle');
  };

  const handleNewScenario = async () => {
    await scenarioCreateAsync({
      token,
      scenarioName: `scenario ${(scenarios?.length || 0) + 1}`,
    });
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
          {basicScenarioList &&
            basicScenarioList.map((item, i) => {
              return (
                <div
                  role="presentation"
                  key={i}
                  className="basicScenario"
                  onClick={() => {
                    dispatch(setSelectedScenario(item));
                  }}
                >
                  <span>{item.alias}</span>
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
        {isFetching ? (
          <></>
        ) : (
          <Space gap="small" direction="vertical">
            {scenarios ? (
              // scenarios?.map((item) => <ScenarioItem key={item.id} item={item} />)
              <SortableScenarioListContainer scenarioList={scenarios} />
            ) : (
              <div className="noResults"></div>
            )}
          </Space>
        )}
      </div>
      <div className="search">
        <Input placeholder="시나리오명을 입력해주세요. " search />
      </div>
    </div>
  );
};
