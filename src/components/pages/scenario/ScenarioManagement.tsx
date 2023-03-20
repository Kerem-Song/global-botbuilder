import { Button, Divider, Input, Space, Switch } from '@components';
import { SortableScenarioListContainer } from '@components/data-display/SortableScenarioListContainer';
import { usePage, useRootState } from '@hooks';
import { useSelectedScenarioChange } from '@hooks/useSelectedScenarioChange';
import { IScenarioModel } from '@models';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';

import { useScenarioClient } from '../../../hooks/client/scenarioClient';

export const ScenarioManagement: FC<{
  scenarios?: IScenarioModel[];
  searchKeyword: string;
  isActivated: boolean;
  setSearchKeyword: (value: string) => void;
  setIsActivated: (value: boolean) => void;
}> = ({ scenarios, searchKeyword, isActivated, setSearchKeyword, setIsActivated }) => {
  const { t } = usePage();
  const { handleChangeSelectedScenario } = useSelectedScenarioChange();
  const [tempScenarioNames, setTempScenarioNames] = useState<number[]>([]);
  const token = useRootState((state) => state.botInfoReducer.token);
  const { scenarioCreateAsync, scenarioCreating } = useScenarioClient();

  const basicScenarioList = useRootState(
    (state) => state.botBuilderReducer.basicScenarios,
  );

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsActivated(e.target.checked);
  };

  useEffect(() => {
    setTempScenarioNames([]);
  }, [scenarios]);

  const handleNewScenario = async () => {
    if (token) {
      const regex = new RegExp('^scenario [0-9]*$');
      const filtered = scenarios?.filter((x) => regex.test(x.alias));
      let index = 1;
      if (filtered || tempScenarioNames) {
        const regex = /[^0-9]/g;
        const results = filtered?.map((x) => Number(x.alias.replace(regex, ''))) || [];
        const max = Math.max(...results, ...tempScenarioNames);
        for (let i = 1; i <= max + 1; i++) {
          if (!results.includes(i)) {
            index = i;
            break;
          }
        }
      }
      setTempScenarioNames([...tempScenarioNames, index]);
      await scenarioCreateAsync({
        token,
        scenarioName: `scenario ${`${index}`.padStart(2, '0')}`,
      });
    }
  };
  const selectedScenarios = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );

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
          onClick={(e) => {
            if (tempScenarioNames.length > 0) {
              return;
            }
            handleNewScenario();
          }}
          disabled={scenarioCreating || tempScenarioNames.length > 0}
        >
          + {t(`ADD_A_NEW_SCENARIO_BTN`)}
        </Button>
      </div>

      <div className="scenarioListWrapper">
        <Space gap="small" direction="vertical">
          {scenarios ? (
            <SortableScenarioListContainer
              disabled={isActivated || searchKeyword.trim().length > 0}
              scenarioList={scenarios.filter(
                (x) =>
                  (!isActivated || x.activated) &&
                  (!searchKeyword ||
                    x.alias.toLowerCase().includes(searchKeyword.toLowerCase())),
              )}
            />
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
    </div>
  );
};
