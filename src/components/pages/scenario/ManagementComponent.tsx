import { IScenarioModel } from '@models';
import { setSelectedScenario } from '@store/botbuilderSlice';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { useScenarioClient } from '../../../hooks/client/scenarioClient';
import usePage from '../../../hooks/usePage';
import { ScenarioManagement } from './ScenarioManagement';
import { VariableComponent } from './variable/VariableComponent';

export const ManagementComponent = () => {
  const { t } = usePage();
  const dispatch = useDispatch();
  const { scenarioId } = useParams();
  const [scenarioTab, setScenarioTab] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isActivated, setIsActivated] = useState(false);
  const [scenarioList, setScenarioList] = useState<IScenarioModel[]>([]);
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();
  const handleScenarioNameTags = (value: boolean) => {
    setScenarioTab(value);
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    setScenarioList(
      data
        .filter((x) => !x.isFallbackFlow && !x.isStartFlow)
        .filter(
          (x) =>
            (!isActivated || x.activated) &&
            (!searchKeyword ||
              x.alias.toLowerCase().includes(searchKeyword.toLowerCase())),
        ),
    );
  }, [searchKeyword, isActivated, data]);

  useEffect(() => {
    if (data && scenarioId) {
      if (scenarioId === 'start') {
        dispatch(setSelectedScenario(data.find((x) => x.isStartFlow)));
      } else if (scenarioId === 'fallback') {
        dispatch(setSelectedScenario(data.find((x) => x.isFallbackFlow)));
      } else {
        dispatch(setSelectedScenario(data.find((x) => x.id === scenarioId)));
      }
    }
  }, [scenarioId, data]);

  return (
    <div className="managementWrapper">
      <div className="scenarioName">
        <p>
          {scenarioTab ? t('SCENARIO') : t('VARIABLE')}
          {scenarioTab ? <span>{scenarioList?.length + 2}</span> : null}
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
          scenarios={scenarioList}
          searchKeyword={searchKeyword}
          isActivated={isActivated}
          setSearchKeyword={setSearchKeyword}
          setIsActivated={setIsActivated}
        />
      ) : (
        <VariableComponent />
      )}
    </div>
  );
};
