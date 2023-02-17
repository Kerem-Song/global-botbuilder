import { Button, Divider, Input, Space, Switch } from '@components';
import { SortableScenarioListContainer } from '@components/data-display/SortableScenarioListContainer';
import { usePage, useRootState } from '@hooks';
import { IScenarioModel } from '@models';
import { setSelectedScenario } from '@store/botbuilderSlice';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useScenarioClient } from '../../../hooks/client/scenarioClient';

export const ScenarioManagement: FC<{
  scenarios?: IScenarioModel[];
}> = ({ scenarios }) => {
  const { t } = usePage();
  const dispatch = useDispatch();
  const [isActivated, setIsActivated] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { scenarioCreateAsync } = useScenarioClient();

  const basicScenarioList = useRootState(
    (state) => state.botBuilderReducer.basicScenarios,
  );

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsActivated(e.target.checked);
  };

  const handleNewScenario = async () => {
    if (token) {
      const regex = new RegExp('^scenario [0-9]*$');
      const filtered = scenarios?.filter((x) => regex.test(x.alias));
      let index = 1;
      if (filtered) {
        const regex = /[^0-9]/g;
        const results = filtered.map((x) => Number(x.alias.replace(regex, '')));
        const max = Math.max(...results);
        for (let i = 1; i <= max + 1; i++) {
          if (!results.includes(i)) {
            index = i;
            break;
          }
        }
      }

      await scenarioCreateAsync({
        token,
        scenarioName: `scenario ${index}`,
      });
    }
  };

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
                  className="basicScenario"
                  onClick={() => {
                    dispatch(setSelectedScenario(item));
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
        <Button block type="primary" onClick={handleNewScenario}>
          + {t(`ADD_A_NEW_SCENARIO_BTN`)}
        </Button>
      </div>

      <div className="scenarioListWrapper">
        <Space gap="small" direction="vertical">
          {scenarios ? (
            // scenarios?.map((item) => <ScenarioItem key={item.id} item={item} />)
            <SortableScenarioListContainer
              scenarioList={scenarios.filter(
                (x) =>
                  (!isActivated || x.activated) &&
                  (!searchKeyword || x.alias.includes(searchKeyword)),
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
          onSearch={setSearchKeyword}
        />
      </div>
    </div>
  );
};
