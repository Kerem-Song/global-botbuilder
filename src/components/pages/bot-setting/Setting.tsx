import { icCopy, icLine } from '@assets';
import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const Setting = () => {
  const { t, navigate } = usePage();
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
        title: t('DEACTIVATE_BOT'),
        description: (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <p>{t('DEACTIVATE_BOT_MESSAGE')}</p>
          </div>
        ),
      });
    }
    if (result) {
      setActivate(false);
      lunaToast.success(t('DEACTIVATE_BOT_SUCCESS_MESSAGE'));
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
      lunaToast.success(t('UPDATE_BOT_SUCCESS_MESSAGE'));
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

  return (
    <div className="settingWrap">
      <Row justify="space-between" align="center" className="m-b-20">
        <Col>
          <div className="title">{t('TITLE')}</div>
        </Col>
        <Col>
          <Space gap={8}>
            {botInfo?.removeCancelExpireUtc ? (
              <Row align="center" gap={16}>
                <Col>
                  <span className="delete-message">
                    {new Date(botInfo?.removeCancelExpireUtc).toLocaleString()}
                    {t('DELETE_BOT_MESSAGE')}
                  </span>
                </Col>
                <Col>
                  <Button type="lineBlue" onClick={() => handleRecoverBot()}>
                    {t('CANCEL_DELETION')}
                  </Button>
                </Col>
              </Row>
            ) : (
              <Button type="lineBlue" onClick={() => handleDeleteBot()}>
                {t('DELETE')}
              </Button>
            )}
            <Button
              type="primary"
              disabled={!checkChange()}
              onClick={() => handleUpdateBot()}
            >
              {t('SAVE')}
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
            <p style={{ fontSize: '16px', fontWeight: 500 }}>{t('DEFAULT_SETTING')}</p>
            <Row align="center" gap={10}>
              <Col style={{ width: '75px' }}>
                <span>{t('BOT_NAME')}</span>
              </Col>
              <Col flex="auto">
                <FormItem>
                  <Input
                    value={botName || ''}
                    onChange={(e) => setBotName(e.target.value)}
                    showCount
                    maxLength={20}
                    placeholder={t('BOT_NAME_PLACEHOLDER')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row align="center" gap={10}>
              <Col style={{ width: '75px' }}>
                <span>{t('BOT_ID')}</span>
              </Col>
              <Col flex="auto">
                <Input disabled value={botInfo?.id || ''} />
              </Col>
              <Col>
                <Button onClick={handleCopyBotId} icon={icCopy}>
                  {t('COPY')}
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
                <p style={{ fontSize: '16px', fontWeight: 500 }}>
                  {t('ACTIVATED_THE_BOT')}
                </p>
              </Col>
              <Space gap={8}>
                {activate ? (
                  <Button type="lineBlue" onClick={() => handleDisableBot()}>
                    {t('DEACTIVATE')}
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => setActivate(true)}>
                    {t('ACTIVATE')}
                  </Button>
                )}

                <Button onClick={() => navigate('/dashboard')}>{t('BOT_LIST')}</Button>
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
                      <p className="channelState">{t('OPERATING_CHANNEL')}</p>
                      <p className="channelName">
                        {botInfo?.channelInfos?.find((x) => x.isLive)?.name || '@ -'}
                      </p>
                    </div>
                  </div>
                  {opLinked ? (
                    <Button type="lineBlue" small onClick={() => setOpLinked(false)}>
                      {t('DISCONNECT')}
                    </Button>
                  ) : (
                    <Button type="primary" small onClick={() => setOpLinked(true)}>
                      {t('CONNECT')}
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
                      <p className="channelState">{t('TEST_CHANNEL')}</p>
                      <p className="channelName">
                        {botInfo?.channelInfos?.find((x) => !x.isLive)?.name || '@ -'}
                      </p>
                    </div>
                  </div>
                  {testLinked ? (
                    <Button type="lineBlue" small onClick={() => setTestLinked(false)}>
                      {t('DISCONNECT')}
                    </Button>
                  ) : (
                    <Button type="primary" small onClick={() => setTestLinked(true)}>
                      {t('CONNECT')}
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
              {t('EXPORT_IMPORT_SCENARIOS')}
            </p>
            <div className="handleScenarioInfo">
              <p className="infoText">{t('EXPORT_IMPORT_SCENARIOS_DESC')}</p>
            </div>
            <div className="duplicateScenarios">
              <div className="text">
                <p>{t('DUPLICATE_SCENARIOS')}</p>
              </div>
              <Button
                type="primary"
                style={{ marginRight: '8px' }}
                onClick={handleExport}
              >
                {t('EXPORT')}
              </Button>
              <Button type="lineBlue">{t('IMPORT')}</Button>
              <Space />
            </div>
          </Space>
        </div>
      </Card>
    </div>
  );
};
