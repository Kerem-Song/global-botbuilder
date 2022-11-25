import { icListMenu, icListMenuHover } from '@assets/index';
import { Input } from '@components/data-entry/Input';
import { Switch } from '@components/data-entry/Switch';
import { Button } from '@components/index';

import { useScenarioList } from '../../../hooks/client/scenario';

export const ScenarioManagement = () => {
  const { getScenarioList } = useScenarioList();
  const { data } = getScenarioList;
  const basicScenarioList = [{ name: 'Welcome' }, { name: 'FAQ' }, { name: 'Help' }];

  const handleSwitch = () => {
    console.log('switch toggle');
  };

  const handleNewScenario = () => {
    console.log('handle new scenario');
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
        {/* <button className="newScenarioBtn">+ 새 시나리오</button> */}
        <Button block shape="round" onClick={handleNewScenario}>
          + 새 시나리오
        </Button>
      </div>

      <div className="scenarioListWrapper">
        {data?.map((item) => (
          <div className="scenarioList" key={item.id}>
            <span>{item.scenarioName}</span>
            <Switch onChange={handleSwitch} />
            <button>
              <i className="fa-solid fa-ellipsis-vertical" />
            </button>
          </div>
        ))}
      </div>

      <div className="search">
        <Input placeholder="시나리오명을 입력해주세요. " />
      </div>
    </div>
  );
};
