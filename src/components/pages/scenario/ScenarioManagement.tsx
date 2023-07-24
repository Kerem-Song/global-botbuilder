import { icEmptyBot, icPlusWhite } from '@assets';
import { Button, Divider, Input, Space, Switch } from '@components';
import { SortableScenarioListContainer } from '@components/data-display/SortableScenarioListContainer';
import { usePage, useRootState } from '@hooks';
import { useSelectedScenarioChange } from '@hooks/useSelectedScenarioChange';
import { IScenarioModel } from '@models';
import { setPopupType, setScenarioPopupOpen } from '@store/scenarioListPopupSlice';
import classNames from 'classnames';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

import { useScenarioClient } from '../../../hooks/client/scenarioClient';
import { ScenarioListPopup } from './ScenarioListPopup';
export const ScenarioManagement: FC<{
  scenarios?: IScenarioModel[];
  searchKeyword: string;
  isActivated: boolean;
  setSearchKeyword: (value: string) => void;
  setIsActivated: (value: boolean) => void;
}> = ({ scenarios, searchKeyword, isActivated, setSearchKeyword, setIsActivated }) => {
  const { t } = usePage();
  const { pathname } = useLocation();
  const { handleChangeSelectedScenario } = useSelectedScenarioChange();
  const dispatch = useDispatch();
  const { scenarioCreating } = useScenarioClient();
  const isScenarioListPopupOpen = useRootState(
    (state) => state.scenarioListPopupReducer.isOpen,
  );
  const basicScenarioList = useRootState(
    (state) => state.botBuilderReducer.basicScenarios,
  );

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsActivated(e.target.checked);
  };

  const selectedScenarios = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );

  const filteredScenarios = scenarios?.filter(
    (x) =>
      (!isActivated || x.activated) &&
      (!searchKeyword || x.alias.toLowerCase().includes(searchKeyword.toLowerCase())),
  );

  useEffect(() => {
    return () => {
      dispatch(setScenarioPopupOpen(false));
    };
  }, [pathname]);

  return (
    <div className="scenarioTabWrapper">
      <div className="openedScenarioOption">
        <p>{t(`ACTIVE_SCENARIOS_SWITCH`)}</p>
        <Switch onChange={handleSwitch} />
      </div>

      <div className="basicScenarioWrapper">
        <p>{t(`DEFAULT_SCENARIO`)}</p>
        <div className="basicScenarioList">
          {basicScenarioList &&
            basicScenarioList.map((item, i) => {
              return (
                <div
                  role="presentation"
                  key={i}
                  className={classNames('basicScenario', {
                    selected: selectedScenarios?.id === item.id,
                  })}
                  onClick={() => {
                    handleChangeSelectedScenario(item);
                  }}
                >
                  <span>{item.alias}</span>
                </div>
              );
            })}
        </div>
        <Divider style={{ margin: '16px 0' }} />
      </div>

      <div className="newScenarioBtn">
        <Button
          block
          type="primary"
          icon={icPlusWhite}
          onClick={() => {
            dispatch(setPopupType('create'));
            dispatch(setScenarioPopupOpen(true));
          }}
          disabled={scenarioCreating}
        >
          {t(`ADD_A_NEW_SCENARIO_BTN`)}
        </Button>
      </div>

      <div
        className={classNames('scenarioListWrapper', {
          hasScrollbar: filteredScenarios && filteredScenarios.length > 10,
        })}
      >
        <Space gap="small" direction="vertical">
          {scenarios ? (
            !filteredScenarios?.length ? (
              <div className="noScenarioResults">
                <img src={icEmptyBot} alt="noScenarioResult" />
                {scenarios.length ? (
                  <p>{t(`NO_SCENARIO_RESULTS`)}</p>
                ) : (
                  <p>{t(`NO_REGISTERED_SCNEARIO`)}</p>
                )}
              </div>
            ) : (
              <SortableScenarioListContainer
                disabled={isActivated || searchKeyword.trim().length > 0}
                scenarioList={filteredScenarios}
              />
            )
          ) : (
            <div className="noResults"></div>
          )}
        </Space>
      </div>
      <div className="search">
        <Input
          placeholder={t(`SEARCH_SCEANRIO_INPUT_PLACEHOLDER`)}
          search
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
          onSearch={(v) => setSearchKeyword(v || '')}
        />
      </div>
      <ScenarioListPopup isOpen={isScenarioListPopupOpen} scenarios={scenarios} />
    </div>
  );
};
