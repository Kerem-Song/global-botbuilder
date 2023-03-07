import { icCopy, icLine } from '@assets';
import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { useEffect, useState } from 'react';

export const Setting = () => {
  const { t, tc, navigate } = usePage();
  const { confirm } = useSystemModal();

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
    if (botInfo) {
      refetchBotInfo(botInfo.id);
      setActivate(botInfo.activated);
      setBotName(botInfo.botName);
      setOpLinked(botInfo?.channelInfos?.find((x) => x.isLive)?.isLinked);
      setTestLinked(botInfo?.channelInfos?.find((x) => !x.isLive)?.isLinked);
    }
  }, [botInfo?.id]);

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
    await botUpdateAsync({
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
          <div className="title">Chatbot Setting</div>
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
                <span>Bot name</span>
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
                <span>Bot ID</span>
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
                <p style={{ fontSize: '16px', fontWeight: 500 }}>Activate the bot</p>
              </Col>
              <Space gap={8}>
                {activate ? (
                  <Button type="lineBlue" onClick={() => handleDisableBot()}>
                    Deactive
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => setActivate(true)}>
                    Activate
                  </Button>
                )}

                <Button onClick={() => navigate('/dashboard')}>Bot list</Button>
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
                      Disconnect
                    </Button>
                  ) : (
                    <Button type="primary" small onClick={() => setOpLinked(true)}>
                      Connect
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
                      Disconnect
                    </Button>
                  ) : (
                    <Button type="primary" small onClick={() => setTestLinked(true)}>
                      Connect
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
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Export/Import Scenarios</p>
            <div className="handleScenarioInfo">
              <p className="infoText">
                If you import another bot, existing set scenarios, utterances, variables,
                entities, etc. will be overwritten. Statistics and history are not
                overwritten.
              </p>
            </div>
            <div className="duplicateScenarios">
              <div className="text">
                <p>Duplicate Scenarios</p>
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
