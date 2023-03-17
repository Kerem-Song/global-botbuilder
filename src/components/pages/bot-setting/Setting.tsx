import { icCopy, icLine } from '@assets';
import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const Setting = () => {
  const { t, tc, navigate } = usePage();
  const { confirm } = useSystemModal();
  const { botId } = useParams();
  const {
    refetchBotInfo,
    botExportAsync,
    botDeleteAsync,
    botRecoverAsync,
    botUpdateAsync,
  } = useBotClient();

  const [activate, setActivate] = useState<boolean>();
  const [opLinked, setOpLinked] = useState<boolean>();
  const [testLinked, setTestLinked] = useState<boolean>();
  const [botName, setBotName] = useState<string>();

  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  useEffect(() => {
    if (botId) {
      refetchBotInfo(botId);
    }
  }, [botId]);

  useEffect(() => {
    if (botInfo) {
      setActivate(botInfo.activated);
      setBotName(botInfo.botName);
      setOpLinked(botInfo.channelInfos?.find((x) => x.isLive)?.isLinked);
      setTestLinked(botInfo.channelInfos?.find((x) => !x.isLive)?.isLinked);
    }
  }, [botInfo]);

  const handleCopyBotId = async () => {
    await util.copyClipboard(botInfo?.id);
    lunaToast.info(t('COPY_BOT_ID_MESSAGE'));
  };

  const handleExport = async () => {
    if (!botInfo) {
      return;
    }
    await botExportAsync({ botId: botInfo.id, botName: botInfo.botName });
  };

  const handleDisableBot = async () => {
    let result: boolean | undefined = true;
    if (botInfo?.activated) {
      result = await confirm({
        title: '봇 비활성화',
        description: (
          <>
            <span>봇을 비활성화 하면, 모든 채놀과 연결이 끊어지고</span>
            <br />
            <span>채널에서 더 이상 봇이 동작하지 않습니다.</span>
            <br />
            <span>비활성화 하시겠습니까?</span>
          </>
        ),
      });
    }
    if (result) {
      setActivate(false);
    }
  };

  const handleDeleteBot = async () => {
    if (!botInfo) {
      return;
    }
    await botDeleteAsync({ botId: botInfo.id });
  };

  const handleRecoverBot = async () => {
    if (!botInfo) {
      return;
    }
    await botRecoverAsync({ botId: botInfo.id });
  };

  const handleUpdateBot = async () => {
    if (!botInfo) {
      return;
    }
    const res = await botUpdateAsync({
      botId: botInfo.id,
      botName: botName !== botInfo.botName ? botName : undefined,
      botActivate: activate !== botInfo.activated ? activate : undefined,
      liveChannelLinked:
        opLinked !== botInfo.channelInfos?.find((x) => x.isLive)?.isLinked
          ? opLinked
          : undefined,
      testChannelLinked:
        testLinked !== botInfo.channelInfos?.find((x) => !x.isLive)?.isLinked
          ? testLinked
          : undefined,
    });

    if (res) {
      lunaToast.success('저장되었습니다.');
    }
  };

  const checkChange = () => {
    if (!botInfo) {
      return false;
    }

    if (botName !== botInfo.botName) {
      return true;
    }

    if (activate !== botInfo.activated) {
      return true;
    }

    if (opLinked !== botInfo.channelInfos?.find((x) => x.isLive)?.isLinked) {
      return true;
    }

    if (testLinked !== botInfo.channelInfos?.find((x) => !x.isLive)?.isLinked) {
      return true;
    }

    return false;
  };

  return (
    <div className="settingWrap">
      <Row justify="space-between" align="center" className="m-b-20">
        <Col>
          <div className="title">챗봇 설정</div>
        </Col>
        <Col>
          <Space gap={8}>
            {botInfo?.removeCancelExpireUtc ? (
              <Row align="center" gap={16}>
                <Col>
                  <span className="delete-message">
                    {new Date(botInfo?.removeCancelExpireUtc).toLocaleString()}에 봇이
                    삭제될 예정입니다.
                  </span>
                </Col>
                <Col>
                  <Button type="lineBlue" onClick={() => handleRecoverBot()}>
                    삭제 취소
                  </Button>
                </Col>
              </Row>
            ) : (
              <Button type="lineBlue" onClick={() => handleDeleteBot()}>
                봇 삭제하기
              </Button>
            )}
            <Button
              type="primary"
              disabled={!checkChange()}
              onClick={() => handleUpdateBot()}
            >
              저장하기
            </Button>
          </Space>
        </Col>
      </Row>

      <Card
        radius="normal"
        bodyStyle={{ padding: '20px' }}
        style={{ border: '1px solid #DCDCDC', marginBottom: '20px' }}
      >
        <form>
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>{t('BASIC_SETTING')}</p>
            <Row align="center" gap={10}>
              <Col>
                <span>봇 이름</span>
              </Col>
              <Col flex="auto">
                <FormItem>
                  <Input
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    showCount
                    maxLength={20}
                    placeholder={t('BOT_NAME_PLACEHOLDER')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row align="center" gap={10}>
              <Col style={{ width: '69px' }}>
                <span>봇 ID</span>
              </Col>
              <Col flex="auto">
                <Input disabled value={botInfo?.id} />
              </Col>
              <Col>
                <Button onClick={handleCopyBotId} icon={icCopy}>
                  Copy
                </Button>
              </Col>
            </Row>
          </Space>
        </form>
      </Card>
      <Card
        radius="normal"
        bodyStyle={{ padding: '20px' }}
        style={{ border: '1px solid #DCDCDC', marginBottom: '20px' }}
      >
        <div className="activateWrap">
          <Space direction="vertical">
            <Row justify="space-between" align="center">
              <Col>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>봇 활성화</p>
              </Col>
              <Space gap={8}>
                {activate ? (
                  <Button type="lineBlue" onClick={() => handleDisableBot()}>
                    비활성화
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => setActivate(true)}>
                    활성화
                  </Button>
                )}

                <Button onClick={() => navigate('/dashboard')}>봇 목록 가기</Button>
              </Space>
            </Row>
            <div className="botCardContainer">
              <div className="botCardWrap">
                <div className="botCard">
                  <div className="channel">
                    <div className="channelImg">
                      <img
                        src={icLine}
                        alt="socialImg"
                        style={{ width: '48px', height: '48px' }}
                      />
                    </div>
                    <div className="channelInfo">
                      <p className="channelState">Operating channel</p>
                      <p className="channelName">
                        {botInfo?.channelInfos?.find((x) => x.isLive)?.name || '@ -'}
                      </p>
                    </div>
                  </div>
                  {opLinked ? (
                    <Button type="lineBlue" small onClick={() => setOpLinked(false)}>
                      연결 해제
                    </Button>
                  ) : (
                    <Button type="primary" small onClick={() => setOpLinked(true)}>
                      연결
                    </Button>
                  )}
                </div>
              </div>
              <div className="botCardWrap">
                <div className="botCard">
                  <div className="channel">
                    <div className="channelImg">
                      <img
                        src={icLine}
                        alt="socialImg"
                        style={{ width: '48px', height: '48px' }}
                      />
                    </div>
                    <div className="channelInfo">
                      <p className="channelState">Test channel</p>
                      <p className="channelName">
                        {botInfo?.channelInfos?.find((x) => !x.isLive)?.name || '@ -'}
                      </p>
                    </div>
                  </div>
                  {testLinked ? (
                    <Button type="lineBlue" small onClick={() => setTestLinked(false)}>
                      연결 해제
                    </Button>
                  ) : (
                    <Button type="primary" small onClick={() => setTestLinked(true)}>
                      연결
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Space>
        </div>
      </Card>
      <Card
        radius="normal"
        bodyStyle={{ padding: '20px' }}
        style={{ border: '1px solid #DCDCDC' }}
      >
        <div className="handleScenariosWrap">
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>
              시나리오 내보내기/가져오기
            </p>
            <div className="handleScenarioInfo">
              <p className="infoText">
                시나리오를 ‘가져오기’ 할 경우, 기존에 세팅된 시나리오, 발화, 변수, 엔티티
                등은 덮어씌워집니다. <br />
                통계 및 히스토리는 덮어씌워지지 않습니다.
              </p>
            </div>
            <div className="duplicateScenarios">
              <div className="text">
                <p>시나리오 복사</p>
              </div>
              <Button
                type="primary"
                style={{ marginRight: '8px' }}
                onClick={handleExport}
              >
                Export
              </Button>
              <Button type="lineBlue">Import</Button>
              <Space />
            </div>
          </Space>
        </div>
      </Card>
    </div>
  );
};
