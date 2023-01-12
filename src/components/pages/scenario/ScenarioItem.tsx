import { Button, Card, Col, Input, Popper, Row, Switch } from '@components';
import { useRootState, useScenarioClient, useSystemModal } from '@hooks';
import { IScenarioModel } from '@models';
import { setSelectedScenario } from '@store/botbuilderSlice';
import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export interface IScenarioItemProps {
  item: IScenarioModel;
}

export const ScenarioItem: FC<IScenarioItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const { confirm } = useSystemModal();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const token = useRootState((state) => state.botBuilderReducer.token);
  const { scenarioDeleteAsync, scenarioRenameAsync } = useScenarioClient();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 혹시 나중에 전체선택으로 바꿔야 하면 넣어야 할 코드
      //inputRef.current.select();
    }
  }, [isEditing]);

  const handleSwitch = () => {
    console.log('switch toggle');
  };

  const handleScenarioDelete = async () => {
    const result = await confirm({
      title: '삭제',
      description: (
        <>
          <span>{`${item.alias}(와)과 연결된 시나리오가 있습니다.`}</span>
          <br />
          <span>: 시작, 시나리오01</span>
          <br />
          <span>정말 삭제하시겠습니까?</span>
        </>
      ),
    });

    if (result) {
      await scenarioDeleteAsync({ token, scenarioId: item.id });
    }
  };

  const handleScenarioRename = async (scenarioName?: string) => {
    if (!scenarioName) {
      toast('시나리오 이름을 입력해 주세요.', {
        position: 'bottom-center',
        theme: 'dark',
        hideProgressBar: true,
      });
      return;
    }
    const res = await scenarioRenameAsync({
      token,
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

  return (
    <Card
      key={item.id}
      radius="small"
      bodyStyle={{ padding: '2px 12px' }}
      onClick={() => {
        dispatch(setSelectedScenario(item));
      }}
    >
      {isEditing ? (
        <Input
          value={item.alias}
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
            <Switch onChange={handleSwitch} />
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
