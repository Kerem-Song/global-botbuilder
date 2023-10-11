import { Button, Card, Col, IPopperItem, Popper, Row, Switch } from '@components';
import { Tooltip } from '@components/navigation/Tooltip';
import { usePage, useRootState, useScenarioClient, useSystemModal } from '@hooks';
import { useSelectedScenarioChange } from '@hooks/useSelectedScenarioChange';
import { IScenarioModel } from '@models';
import { lunaToast } from '@modules/lunaToast';
import {
  setPopupType,
  setScenarioListItem,
  setScenarioPopupOpen,
} from '@store/scenarioListPopupSlice';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export interface IScenarioItemProps {
  item: IScenarioModel;
}

export const ScenarioItem: FC<IScenarioItemProps> = React.memo(({ item }) => {
  const { t, tc, i18n } = usePage();
  const { confirm } = useSystemModal();
  const [scenarioMenus, setScenarioMenus] = useState<
    IPopperItem<{
      action: ((item: IScenarioModel) => void) | null;
    }>[]
  >([]);
  const token = useRootState((state) => state.botInfoReducer.token);
  const {
    scenarioDeleteAsync,
    scenarioActiveAsync,
    scenarioCheckDeleteAsync,
    scenarioDuplicateMutateAsync,
  } = useScenarioClient();
  const dispatch = useDispatch();

  const { handleChangeSelectedScenario } = useSelectedScenarioChange();

  const handleSwitch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const activated = e.target.checked;

    const exception = await scenarioCheckDeleteAsync({
      scenarioId: item.id,
    });

    if (!exception || activated) {
      const res = await scenarioActiveAsync({
        flowId: item.id,
        activated: activated,
      });
      if (res?.data.result === true) {
        lunaToast.success(t(`SCENARIO_ON_MESSAGE`));
      } else {
        lunaToast.success(t(`SCENARIO_OFF_MESSAGE`));
      }
    } else if (exception) {
      const result = await confirm({
        title: t('SCENARIO_OFF_TITLE'),
        description: (
          <>
            <span>{t('SCENARIO_OFF_LINK_MESSAGE', { scenario: item.alias })}</span>
            <br />
            <span style={{ color: '#ff4975', fontWeight: 500 }}>
              :{' '}
              {[...new Set(exception.linkInfos.map((l) => l.currentFlowAlias))].join(',')}
            </span>
            <br />
            <span>{tc('OFF_CONFIRM')}</span>
          </>
        ),
      });
      if (result) {
        const res = await scenarioActiveAsync({
          flowId: item.id,
          activated: activated,
        });
        if (res) {
          lunaToast.success(t(`SCENARIO_OFF_MESSAGE`));
        }
      }
    }
  };

  const handleScenarioDelete = async (item: IScenarioModel) => {
    const exception = await scenarioCheckDeleteAsync({
      scenarioId: item.id,
    });
    if (!exception) {
      const result = await confirm({
        title: t('SCENARIO_DELETE_TITLE'),
        description: (
          <>
            <span>{tc('NO_RECOVERY_MESSAGE')}</span>
            <br />
            <span>{tc('DELETE_CONFIRM')}</span>
          </>
        ),
      });

      if (result) {
        const res = await scenarioDeleteAsync({ scenarioId: item.id });
        if (res) {
          lunaToast.success(tc('DELETE_MESSAGE'));
        }
      }
    } else {
      const result = await confirm({
        title: t('SCENARIO_DELETE_TITLE'),
        description: (
          <>
            <span>{t('SCENARIO_DELETE_LINK_MESSAGE', { scenario: item.alias })}</span>
            <br />
            <span style={{ color: '#ff4975', fontWeight: 500 }}>
              :{' '}
              {[...new Set(exception.linkInfos.map((l) => l.currentFlowAlias))].join(',')}
            </span>
            <br />
            <span>{tc('DELETE_CONFIRM')}</span>
          </>
        ),
      });

      if (result) {
        const res = await scenarioDeleteAsync({ scenarioId: item.id });
        if (res) {
          lunaToast.success(tc(`DELETE_MESSAGE`));
        }
      }
    }
  };

  const handleDuplicateScenario = async () => {
    // const result = await confirm({
    //   title: t('DUPLICATE_SCENARIO'),
    //   description: (
    //     <>
    //       <span style={{ whiteSpace: 'pre-line' }}>
    //         {t('DUPLICATE_SCENARIO_DESC', { scenario: item.alias })}
    //       </span>
    //     </>
    //   ),
    // });
    // if (result) {
    //   const res = await scenarioDuplicateMutateAsync({ scenario: item });

    //   if (res) {
    //     lunaToast.success(t(`DUPLICATEING_SCENARIO_IS_SUCCESS`));
    //   }
    dispatch(setPopupType('duplicate'));
    dispatch(setScenarioListItem(item));
    dispatch(setScenarioPopupOpen(true));
  };

  const handleScenariRename = (item: IScenarioModel) => {
    dispatch(setPopupType('rename'));
    dispatch(setScenarioListItem(item));
    dispatch(setScenarioPopupOpen(true));
  };

  const selectedScenarios = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );

  const selectedScenario = classNames({ selected: selectedScenarios?.id === item.id });

  useEffect(() => {
    setScenarioMenus([
      {
        id: `rename`,
        name: t('RENAME'),
        data: {
          action: handleScenariRename,
        },
        type: selectedScenarios?.id !== item.id ? 'disable' : 'normal',
      },
      {
        id: `delete`,
        name: t('DELETE'),
        data: {
          action: handleScenarioDelete,
        },
        type: selectedScenarios?.id !== item.id ? 'disable' : 'normal',
      },
      {
        id: 'duplicate',
        name: t(`DUPLICATION_SCEANRIO`),
        data: {
          action: handleDuplicateScenario,
        },
        type: 'normal',
      },
    ]);
  }, [selectedScenario, item, i18n.language]);

  return (
    <Card
      key={item.id}
      radius="small"
      bodyStyle={{ padding: '8px 12px', cursor: 'pointer' }}
      onClick={() => {
        if (item.id === selectedScenarios?.id) {
          return;
        }
        handleChangeSelectedScenario(item);
      }}
      className={selectedScenario}
    >
      <Row align="center" style={{ flexWrap: 'nowrap' }}>
        <Tooltip
          tooltip={item.alias}
          placement="bottom-start"
          offset={[0, 10]}
          disable={item.alias.length <= 14}
        >
          <Col className="scenarioListName">{item.alias}</Col>
        </Tooltip>
        <Col className="scenarioListSwitch">
          <Switch onChange={handleSwitch} checked={item.activated} />
        </Col>
        <Col>
          <Popper
            placement="right-start"
            offset={[5, 10]}
            popperItems={scenarioMenus}
            onChange={(m) => {
              m.type !== 'disable' && m.data?.action?.(item);
            }}
            popup
            popupList
          >
            <Button small shape="ghost">
              <i className="fa-solid fa-ellipsis-vertical" />
            </Button>
          </Popper>
        </Col>
      </Row>
    </Card>
  );
});

ScenarioItem.displayName = 'ScenarioItem';
