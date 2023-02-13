import { useRootState } from '@hooks';
import classNames from 'classnames';
import { useState } from 'react';

import { useScenarioClient } from '../../../hooks/client/scenarioClient';
import usePage from '../../../hooks/usePage';
import { ScenarioManagement } from './ScenarioManagement';
import { VariablesManagement } from './variable/VariablesManagement';

export const ManagementComponent = () => {
  const { t } = usePage();
  const [scenarioTab, setScenarioTab] = useState<boolean>(true);
  const scenarioName = '시나리오';
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();
  const handleScenarioNameTags = () => {
    setScenarioTab(!scenarioTab);
  };

  return (
    <div className="managementWrapper">
      <div className="scenarioName">
        <p>
          {scenarioTab ? scenarioName : '변수'}
          {scenarioTab ? <span>{data?.length}</span> : null}
        </p>
        <div className="scenarioNameTabs">
          <div
            className={classNames('tab scenario', { on: scenarioTab })}
            onClick={handleScenarioNameTags}
            role="presentation"
          ></div>
          <div
            className={classNames('tab variable', { on: !scenarioTab })}
            onClick={handleScenarioNameTags}
            role="presentation"
          ></div>
        </div>
      </div>
      {scenarioTab ? <ScenarioManagement scenarios={data} /> : <VariablesManagement />}
    </div>
  );
};
