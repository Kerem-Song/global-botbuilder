import classNames from 'classnames';
import { useState } from 'react';

import usePage from '../../../hooks/usePage';
import { ScenarioManagement } from './ScenarioManagement';
import { VariablesManagement } from './VariablesManagement';

export const ManagementComponent = () => {
  const { t } = usePage();
  const [scenarioTab, setScenarioTab] = useState<boolean>(true);
  const scenarioName = '시나리오 이름';

  const handleScenarioNameTags = () => {
    setScenarioTab(!scenarioTab);
  };

  return (
    <div className="managementWrapper">
      <div className="scenarioName">
        <p>{scenarioTab ? scenarioName : '변수'}</p>
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
      {scenarioTab ? <ScenarioManagement /> : <VariablesManagement />}
    </div>
  );
};
