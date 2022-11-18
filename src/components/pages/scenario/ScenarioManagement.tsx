import { Input } from '@components/data-entry/Input';
import { Switch } from '@components/data-entry/Switch';

import { useScenarioList } from '../../../hooks/client/scenario';

export const ScenarioManagement = () => {
  const { getScenarioList } = useScenarioList();
  const { data } = getScenarioList;

  const handleSwitch = () => {
    console.log('switch toggle');
  };

  return (
    <div className="scenarioTabWrapper">
      <div className="openedScenarioOption">
        <input type="checkbox" className="" />
        <p>활성 시나리오만 보기</p>
      </div>

      <div className="basicScenario">
        <div>챗봇 도움말</div>
        <div>탈출</div>
        <div>FAQ 생성</div>
      </div>

      <div className="startBtn">
        <span>시작</span>
        <button className="newScenarioBtn">+ 새 시나리오</button>
      </div>

      <div className="scenarioListWrapper">
        {data?.map((item) => (
          <div className="scenarioList" key={item.id}>
            <Switch onChange={handleSwitch} />
            <span>{item.scenarioName}</span>
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
