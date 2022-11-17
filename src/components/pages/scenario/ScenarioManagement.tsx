import { Checkbox } from '@components/data-entry/Checkbox';
import { Input } from '@components/data-entry/Input';
import { Switch } from '@components/data-entry/Switch';
import { Divider } from '@components/layout/Divider';
import classNames from 'classnames';
import { useState } from 'react';

import { useScenarioList } from '../../../hooks/client/scenario';
import usePage from '../../../hooks/usePage';

export const ScenarioManagement = () => {
  const { t } = usePage();
  const [scenarioTab, setScenarioTab] = useState<boolean>(true);
  const { getScenarioList } = useScenarioList();

  const scenarioName = '시나리오 이름';
  const { data } = getScenarioList;
  const handleSwitch = () => {
    console.log('switch toggle');
  };

  const handleScenarioNameTags = () => {
    setScenarioTab(!scenarioTab);
  };

  return (
    <div className="scenarioManagementWrapper">
      <div className="scenarioName">
        <p>{scenarioName}</p>
        <div className="scenarioNameTabs">
          <i
            className={classNames('fa-solid fa-bars', scenarioTab ? 'on' : '')}
            onClick={handleScenarioNameTags}
            role="presentation"
          />
          <i
            className={classNames('fa-solid fa-code', scenarioTab ? '' : 'on')}
            onClick={handleScenarioNameTags}
            role="presentation"
          />
        </div>
      </div>

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
