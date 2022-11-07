import { Input } from '@components/data-entry/Input';
import { Switch } from '@components/data-entry/Switch';
import { Title } from '@components/general/Title';

import usePage from '../../../hooks/usePage';

export const ScenarioManagement = () => {
  const { t } = usePage();

  const scenarioName = '시나리오 이름';
  const scenarioList = [
    { id: 1, scenarioName: '시나리오 1' },
    { id: 2, scenarioName: '시나리오 2' },
  ];

  const handleSwitch = () => {
    console.log('switch toggle');
  };

  return (
    <div className="scenarioManagementWrapper">
      <div className="scenarioName">
        <p>{scenarioName}</p>
      </div>
      <div className="openedScenarioOption">
        <p>활성 시나리오만 보기</p>
      </div>
      <div className="basicScenarioListWrapper">
        <div className="desc">
          <p>기본 제공 시나리오 목록 영역</p>
          <br />
          <p>(웰컴, 챗봇 도움말, 탈출, FAQ, 상담 연결 카테고리 선택 등)</p>
        </div>
        <div className="startBtn">
          <span>시작</span>
          <button className="newScenarioBtn">+ 새 시나리오</button>
        </div>
        <div className="scenarioListWrapper">
          {scenarioList.map((item) => (
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
