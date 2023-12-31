import { usePage } from '@hooks';
import { useScenarioListClient } from '@hooks/client/scenarioListClient';
import { IScenarioModel } from '@models';
import { basicScenarioTypes } from '@models/types/BasicScenarioType';
import { setSelectedScenario } from '@store/botbuilderSlice';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { ParameterComponent } from './parameter/ParameterComponent';
import { ScenarioManagement } from './ScenarioManagement';

export const ManagementComponent = React.memo(() => {
  const { t } = usePage();
  const dispatch = useDispatch();
  const { scenarioId } = useParams();
  const [scenarioTab, setScenarioTab] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isActivated, setIsActivated] = useState(false);
  const [scenarioList, setScenarioList] = useState<IScenarioModel[]>([]);
  const { getScenarioList } = useScenarioListClient(scenarioId);
  const { data } = getScenarioList();
  const handleScenarioNameTags = (value: boolean) => {
    setScenarioTab(value);
  };

  const filteredScenarios = useMemo(() => {
    return scenarioList?.filter(
      (x) =>
        (!isActivated || x.activated) &&
        (!searchKeyword || x.alias.toLowerCase().includes(searchKeyword.toLowerCase())),
    );
  }, [scenarioList, isActivated, searchKeyword]);

  useEffect(() => {
    if (!data) {
      return;
    }
    setScenarioList(data.filter((x) => !x.isFallbackFlow && !x.isStartFlow));

    // 메모리 관리
    return () => {
      setScenarioList([]);
    };
  }, [searchKeyword, isActivated, data]);

  useEffect(() => {
    if (data && scenarioId) {
      if (scenarioId === basicScenarioTypes.start) {
        dispatch(setSelectedScenario(data.find((x) => x.isStartFlow)));
      } else if (scenarioId === basicScenarioTypes.fallback) {
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
          {!scenarioTab ? null : !isActivated ? (
            <span>{scenarioList?.length + 2}</span>
          ) : (
            <span>{filteredScenarios.length + 2}</span>
          )}
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
        <ParameterComponent />
      )}
    </div>
  );
});

ManagementComponent.displayName = 'ManagementComponent';
