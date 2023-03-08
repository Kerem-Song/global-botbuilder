import { Button, Card, Col, Input, Popper, Row, Switch } from '@components';
import { usePage, useRootState, useScenarioClient, useSystemModal } from '@hooks';
import { IScenarioModel } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { setSelectedScenario } from '@store/botbuilderSlice';
import classNames from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export interface IScenarioItemProps {
  item: IScenarioModel;
}

export const ScenarioItem: FC<IScenarioItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const { t, tc } = usePage();
  const { confirm } = useSystemModal();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const token = useRootState((state) => state.botInfoReducer.token);
  const {
    scenarioDeleteAsync,
    scenarioRenameAsync,
    scenarioActiveAsync,
    scenarioCheckDeleteAsync,
  } = useScenarioClient();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 혹시 나중에 전체선택으로 바꿔야 하면 넣어야 할 코드
      //inputRef.current.select();
    }
  }, [isEditing]);

  const handleSwitch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await scenarioActiveAsync({
      token: token!,
      flowId: item.id,
      activated: e.target.checked,
    });
    //console.log('switch toggle');
  };

  const handleScenarioDelete = async () => {
    const exception = await scenarioCheckDeleteAsync({
      token: token!,
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
        const res = await scenarioDeleteAsync({ token: token!, scenarioId: item.id });
        if (res) {
          lunaToast.success('삭제되었습니다.');
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
              : {exception.linkInfos.map((l) => l.currentFlowAlias).join(',')}
            </span>
            <br />
            <span>{tc('DELETE_CONFIRM')}</span>
          </>
        ),
      });

      if (result) {
        const res = await scenarioDeleteAsync({ token: token!, scenarioId: item.id });
        if (res) {
          lunaToast.success('삭제되었습니다.');
        }
      }
    }
  };

  const handleScenarioRename = async (scenarioName?: string) => {
    if (!scenarioName) {
      const message = t('INPUT_SCENARIO_NAME');
      toast(message, {
        position: 'bottom-center',
        theme: 'dark',
        hideProgressBar: true,
      });
      return;
    }
    const res = await scenarioRenameAsync({
      token: token!,
      scenario: { ...item, alias: scenarioName },
    });
    if (res) {
      setIsEditing(false);
    }
  };

  const handleScenariRename = () => {
    setIsEditing(true);
  };

  const scenarioMenus = [
    {
      id: `rename`,
      name: 'Rename',
      data: {
        action: handleScenariRename,
      },
    },
    {
      id: `delete`,
      name: 'Delete',
      data: {
        action: handleScenarioDelete,
      },
    },
  ];

  const selectedScenarios = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );

  const selectedScenario = classNames({ selected: selectedScenarios?.id === item.id });

  return (
    <Card
      key={item.id}
      radius="small"
      bodyStyle={{ padding: '8px 12px', cursor: 'pointer' }}
      onClick={() => {
        dispatch(setSelectedScenario(item));
      }}
      className={selectedScenario}
    >
      {isEditing ? (
        <Input
          defaultValue={item.alias}
          showCount
          maxLength={20}
          ref={inputRef}
          onBlur={(e) => {
            handleScenarioRename(e.target.value);
          }}
          onPressEsc={() => {
            setIsEditing(false);
          }}
          onPressEnter={(value) => {
            handleScenarioRename(value);
          }}
        />
      ) : (
        <Row align="center" style={{ flexWrap: 'nowrap' }}>
          <Col flex="auto" style={{ fontSize: '13px' }} className="scenarioListName">
            {item.alias}
          </Col>
          <Col className="scenarioListSwitch">
            <Switch onChange={handleSwitch} checked={item.activated} />
          </Col>
          <Col>
            <Popper
              placement="right-start"
              offset={[5, 10]}
              popperItems={scenarioMenus}
              onChange={(m) => {
                m.data?.action?.();
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
      )}
    </Card>
  );
};
