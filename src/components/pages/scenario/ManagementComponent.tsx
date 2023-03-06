import classNames from 'classnames';
import { useState } from 'react';

import { useScenarioClient } from '../../../hooks/client/scenarioClient';
import usePage from '../../../hooks/usePage';
import { ScenarioManagement } from './ScenarioManagement';
import { VariablesManagement } from './variable/VariablesManagement';

export const ManagementComponent = () => {
  const { t } = usePage();
  const [scenarioTab, setScenarioTab] = useState<boolean>(true);
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();
  const handleScenarioNameTags = (value: boolean) => {
    setScenarioTab(value);
  };

  return (
    <div className="managementWrapper">
      <div className="scenarioName">
        <p>
          {scenarioTab ? t('SCENARIO') : t('VARIABLE')}
          {scenarioTab ? <span>{data?.length}</span> : null}
        </p>
        <div className="scenarioNameTabs">
          <div
            className={classNames('tab scenario', { on: scenarioTab })}
            onClick={() => handleScenarioNameTags(true)}
            role="presentation"
          ></div>
          <div
            className={classNames('tab variable', { on: !scenarioTab })}
            onClick={() => handleScenarioNameTags(false)}
            role="presentation"
          ></div>
        </div>
      </div>
      {scenarioTab ? (
        <ScenarioManagement
          scenarios={data?.filter((x) => !x.isFallbackFlow && !x.isStartFlow)}
        />
      ) : (
        <VariablesManagement />
      )}
    </div>
  );
};
