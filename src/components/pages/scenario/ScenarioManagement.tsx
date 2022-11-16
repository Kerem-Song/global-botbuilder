import { Input } from '@components/data-entry/Input';
import { Switch } from '@components/data-entry/Switch';
import { Title } from '@components/general/Title';
import { Divider } from '@components/layout/Divider';

import { useScenarioList } from '../../../hooks/client/scenario';
import usePage from '../../../hooks/usePage';

export const ScenarioManagement = () => {
  const { t } = usePage();

  const { getScenarioList } = useScenarioList();

  const scenarioName = '시나리오 이름';
  const { data } = getScenarioList;
  const handleSwitch = () => {
    console.log('switch toggle');
  };

  return (
    <div className="scenarioManagementWrapper">
      <div className="scenarioName">
        <p>{scenarioName}</p>
      </div>
      <Divider />
      <div className="openedScenarioOption">
        <p>활성 시나리오만 보기</p>
      </div>
      <Divider />
      <div className="basicScenarioListWrapper">
        <div className="basicScenario">
          <div>챗봇 도움말</div>
          <div>탈출</div>
          <div>FAQ 생성</div>
        </div>
        <Divider />
        <div className="startBtn">
          <span>시작</span>
          <button className="newScenarioBtn">+ 새 시나리오</button>
        </div>
        <Divider />
        <div className="scenarioListWrapper">
          {data?.map((item) => (
            <div className="scenarioList" key={item.id}>
              <Switch onChange={handleSwitch} />
              <span>{item.scenarioName}</span>
              <button>;</button>
            </div>
          ))}
        </div>
      </div>
      <div className="search">
        <Input placeholder="시나리오명을 입력해주세요. " />
      </div>
    </div>
  );
};
