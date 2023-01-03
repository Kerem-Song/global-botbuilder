import { Button, Card, Col, Input, Popper, Row, Switch } from '@components';
import { useScenarioClient, useSystemModal } from '@hooks';
import { IScenarioModel } from '@models';
import { FC, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export interface IScenarioItemProps {
  item: IScenarioModel;
}

export const ScenarioItem: FC<IScenarioItemProps> = ({ item }) => {
  const { confirm } = useSystemModal();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { scenarioDeleteAsync, scenarioUpdateAsync } = useScenarioClient();

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
          <span>{`${item.scenarioName}(와)과 연결된 시나리오가 있습니다.`}</span>
          <br />
          <span>: 시작, 시나리오01</span>
          <br />
          <span>정말 삭제하시겠습니까?</span>
        </>
      ),
    });

    if (result) {
      await scenarioDeleteAsync(item.id);
    }
  };

  const handleScenarioUpdate = async (scenarioName?: string) => {
    if (!scenarioName) {
      toast('시나리오 이름을 입력해 주세요.', {
        position: 'bottom-center',
        theme: 'dark',
        hideProgressBar: true,
      });
      return;
    }
    const res = await scenarioUpdateAsync({ ...item, scenarioName });
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
    <Card key={item.id} radius="small" bodyStyle={{ padding: '2px 12px' }}>
      {isEditing ? (
        <Input
          value={item.scenarioName}
          showCount
          maxLength={20}
          ref={inputRef}
          onBlur={(e) => {
            handleScenarioUpdate(e.target.value);
          }}
          onPressEsc={() => {
            setIsEditing(false);
          }}
          onPressEnter={(value) => {
            handleScenarioUpdate(value);
          }}
        />
      ) : (
        <Row align="center" style={{ flexWrap: 'nowrap' }}>
          <Col flex="auto" style={{ fontSize: '13px' }} className="scenarioListName">
            {item.scenarioName}
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
