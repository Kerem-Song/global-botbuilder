import { icCopy, icLine } from '@assets';
import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useBotClient, usePage, useRootState } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { useEffect, useState } from 'react';

export const Setting = () => {
  const { t, navigate } = usePage();

  const { refetchBotInfo } = useBotClient();

  const [activate, setActivate] = useState<boolean>();

  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  useEffect(() => {
    if (botInfo) {
      refetchBotInfo(botInfo.id);
      setActivate(botInfo.activated);
    }
  }, [botInfo?.id]);

  const handleCopyBotId = async () => {
    await util.copyClipboard(botInfo?.id);
    lunaToast.info(t('COPY_BOT_ID_MESSAGE'));
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
              <Button type="lineBlue">삭제 취소</Button>
            ) : (
              <Button type="lineBlue">봇 삭제하기</Button>
            )}
            <Button type="primary">저장하기</Button>
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
                    value={botInfo?.botName}
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
                  <Button type="lineBlue" onClick={() => setActivate(false)}>
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
                  {botInfo?.channelInfos?.find((x) => x.isLive)?.isLinked ? (
                    <Button type="lineBlue" small>
                      Disconnect
                    </Button>
                  ) : (
                    <Button type="primary" small>
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
                  {botInfo?.channelInfos?.find((x) => !x.isLive)?.isLinked ? (
                    <Button type="lineBlue" small>
                      Disconnect
                    </Button>
                  ) : (
                    <Button type="primary" small>
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
              <Button type="primary" style={{ marginRight: '8px' }}>
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
