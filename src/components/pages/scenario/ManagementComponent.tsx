import { useRootState } from '@hooks';
import classNames from 'classnames';
import { useState } from 'react';

import { useScenarioClient } from '../../../hooks/client/scenarioClient';
import usePage from '../../../hooks/usePage';
import { ScenarioManagement } from './ScenarioManagement';
import { VariablesManagement } from './VariablesManagement';
export const ManagementComponent = () => {
  const { t } = usePage();
  const token = useRootState((state) => state.botBuilderReducer.token);
  const [scenarioTab, setScenarioTab] = useState<boolean>(true);
  const scenarioName = '시나리오';
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList(token);
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
            className={classNames('tab scenario', scenarioTab ? 'on' : '')}
            onClick={handleScenarioNameTags}
            role="presentation"
          ></div>
          <div
            className={classNames('tab variable', scenarioTab ? '' : 'on')}
            onClick={handleScenarioNameTags}
            role="presentation"
          ></div>
        </div>
      </div>
      {scenarioTab ? <ScenarioManagement scenarios={data} /> : <VariablesManagement />}
    </div>
  );
};
