import { icCopy, imgLinebot, imgLinebotInactivate } from '@assets';
import { Button, Card, Col, Input, Row, Space } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { IBotSetting } from '@models/interfaces/IBotSetting';
import { BOTNAME_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import * as yup from 'yup';

export const Setting = () => {
  const { t, tc, navigate } = usePage();
  const { confirm, info } = useSystemModal();
  const { botId } = useParams();
  const { refetchBotInfo, botExportAsync, botUpdateAsync, botActivateAsync } =
    useBotClient();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const [activate, setActivate] = useState<boolean>();
  const [opLinked, setOpLinked] = useState<boolean>();
  const [testLinked, setTestLinked] = useState<boolean>();
  const [isSaveBtnActive, setIsSaveBtnActive] = useState<boolean>(false);

  const botNameSchema = yup.object({
    botName: yup
      .string()
      .trim()
      .required(tc('REQUIRE_MESSAGE'))
      .min(2, tc('MIN_LENGTH_MESSAGE', { val: 2 }))
      .matches(BOTNAME_REGEX, {
        message: tc('BOTNAME_REGEX_MESSAGE'),
      }),
  });

  const {
    reset,
    trigger,
    control,
    formState: { errors },
  } = useForm<IBotSetting>({
    defaultValues: {
      botId: botInfo?.id,
      botName: botInfo?.botName,
    },
    resolver: yupResolver(botNameSchema),
  });

  const { field } = useController({ name: 'botName', control });

  const handleBotName = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    setIsSaveBtnActive(true);
  };

  const handleUpdateBot = async () => {
    const name = field.value.trim();

    if (!botInfo) {
      return;
    }

    if (name === '') {
      trigger('botName');
      return;
    } else if (name.length < 2) {
      trigger('botName');
      return;
    } else if (!BOTNAME_REGEX.test(name)) {
      trigger('botName');
      return;
    }

    const res = await botUpdateAsync({
      botId: botInfo.id,
      botName: name !== botInfo.botName ? name : undefined,
    });

    if (res?.data.isSuccess === true) {
      lunaToast.success(tc('SAVE_MESSAGE'));
      setIsSaveBtnActive(false);
    }
  };

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

  const handleActivateBot = async () => {
    if (!botInfo) {
      return;
    }
    const res = await botActivateAsync({
      botId: botInfo.id,
      isActivate: true,
    });

    if (res?.data.isSuccess === true) {
      console.log('res', res);
    } else if (res?.data.exception.errorCode === 7631) {
      await info({
        title: t('DISABLED_BOT_ACTIVATED'),
        description: (
          <p style={{ whiteSpace: 'pre-wrap' }}>{t('DISABLED_BOT_ACTIVATED_MESSAGE')}</p>
        ),
      });
    }
  };

  const handleDisableBot = async () => {
    let result: boolean | undefined = true;
    if (botInfo?.activated) {
      result = await confirm({
        title: t('DEACTIVATE_BOT'),
        description: (
          <p style={{ whiteSpace: 'pre-wrap' }}>{t('DEACTIVATE_BOT_MESSAGE')}</p>
        ),
      });
    }
    if (result) {
      await botActivateAsync({
        botId: botInfo!.id,
        isActivate: false,
      });
      lunaToast.success(t('DEACTIVATE_BOT_SUCCESS_MESSAGE'));
    }
  };

  const handleConnectOpChannel = async () => {
    if (!opLinked) {
      const res = await confirm({
        title: t('CONNECT_CHANNEL'),
        description: (
          <>
            <span className="connetChannel">@루나소프트 </span>
            <span>{t('CONFIRM_CONNECT_CHANNEL_MESSAGE')}</span>
          </>
        ),
      });
      if (res) {
        setOpLinked(true);
        await info({
          title: t('CONNECT_CHANNEL'),
          description: (
            <>
              <span className="connetChannel">@루나소프트 </span>
              <span style={{ whiteSpace: 'pre-wrap' }}>
                {t('CONNECT_CHANNEL_SUCCESS_MESSAGE')}
              </span>
            </>
          ),
        });
      }
    }
  };

  const handleConnectTestChannel = async () => {
    if (!testLinked) {
      const res = await confirm({
        title: t('CONNECT_CHANNEL'),
        description: (
          <>
            <span className="connetChannel">@루나소프트 </span>
            <span>{t('CONFIRM_CONNECT_CHANNEL_MESSAGE')}</span>
          </>
        ),
      });
      if (res) {
        setTestLinked(true);
        await info({
          title: t('CONNECT_CHANNEL'),
          description: (
            <>
              <span className="connetChannel">@루나소프트 </span>
              <span style={{ whiteSpace: 'pre-wrap' }}>
                {t('CONNECT_CHANNEL_SUCCESS_MESSAGE')}
              </span>
            </>
          ),
        });
      }
    }
  };

  const preventGoBack = async () => {
    const result = await confirm({
      title: t('SAVE'),
      description: <p style={{ whiteSpace: 'pre-wrap' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>,
    });
    if (result) {
      history.go(-1);
    } else {
      history.pushState(null, '', location.href);
    }
  };

  useEffect(() => {
    if (botId) {
      refetchBotInfo(botId);
    }
  }, [botId]);

  useEffect(() => {
    if (botInfo) {
      const resetValue = {
        botId: botInfo.id,
        botName: botInfo.botName,
      };
      reset(resetValue);
      setActivate(botInfo.activated);
      setOpLinked(botInfo.channelInfos?.find((x) => x.isLive)?.isLinked);
      setTestLinked(botInfo.channelInfos?.find((x) => !x.isLive)?.isLinked);
    }
  }, [botInfo]);

  useEffect(() => {
    if (isSaveBtnActive) {
      (() => {
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', preventGoBack);
      })();

      return () => {
        window.removeEventListener('popstate', preventGoBack);
      };
    }
  }, [isSaveBtnActive]);

  return (
    <div className="settingWrap">
      <Row className="m-b-20" justify="space-between" align="center">
        <Col>
          <div className="title">{t('TITLE')}</div>
        </Col>
      </Row>
      <Card className="settingCardWrap" radius="normal">
        <form>
          <Space direction="vertical">
            <p className="settingCardTitle">{t('DEFAULT_SETTING')}</p>
            <Row gap={10} align="center">
              <Col className="botInfo">
                <span>{t('BOT_NAME')}</span>
                <span className="required"> *</span>
              </Col>
              <Col flex="auto">
                <Input
                  value={field.value || ''}
                  onChange={handleBotName}
                  isError={errors.botName?.message ? true : false}
                  placeholder={t('BOT_NAME_PLACEHOLDER')}
                  maxLength={20}
                  showCount
                />
                <span className="error-message">{errors.botName?.message}</span>
              </Col>
              <Col>
                <Button
                  type="primary"
                  disabled={isSaveBtnActive ? false : true}
                  onClick={handleUpdateBot}
                >
                  {t('SAVE')}
                </Button>
              </Col>
            </Row>
            <Row gap={10} align="center">
              <Col className="botInfo">
                <span>{t('BOT_ID')}</span>
              </Col>
              <Col flex="auto">
                <Input className="botId" value={botInfo?.id || ''} disabled />
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
      <Card className="settingCardWrap" radius="normal">
        <div className="activateWrap">
          <Space direction="vertical">
            <Row justify="space-between" align="center">
              <Col>
                <p className="settingCardTitle">{t('ACTIVATED_THE_BOT')}</p>
              </Col>
              <Space gap={8}>
                {activate ? (
                  <Button type="lineBlue" onClick={() => handleDisableBot()}>
                    {t('DEACTIVATE')}
                  </Button>
                ) : (
                  <Button type="primary" onClick={handleActivateBot}>
                    {t('ACTIVATE')}
                  </Button>
                )}
                <Button onClick={() => navigate('/dashboard')}>{t('BOT_LIST')}</Button>
              </Space>
            </Row>
            <div className="botActivateCardContainer">
              <div className="botActivateCardWrap">
                <div className="botActivateCard">
                  <div className="channel">
                    <div className="channelImg">
                      {opLinked ? (
                        <img src={imgLinebot} alt="socialImg" />
                      ) : (
                        <img src={imgLinebotInactivate} alt="socialImg" />
                      )}
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
                    <Button
                      type="primary"
                      disabled={activate === false ? true : false}
                      small
                      onClick={handleConnectOpChannel}
                    >
                      {t('CONNECT')}
                    </Button>
                  )}
                </div>
              </div>
              <div className="botActivateCardWrap">
                <div className="botActivateCard">
                  <div className="channel">
                    <div className="channelImg">
                      {testLinked ? (
                        <img src={imgLinebot} alt="socialImg" />
                      ) : (
                        <img src={imgLinebotInactivate} alt="socialImg" />
                      )}
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
                    <Button
                      type="primary"
                      disabled={activate === false ? true : false}
                      small
                      onClick={handleConnectTestChannel}
                    >
                      {t('CONNECT')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Space>
        </div>
      </Card>
      <Card className="settingCardWrap" radius="normal">
        <div className="handleScenariosWrap">
          <Space direction="vertical">
            <p className="settingCardTitle">{t('EXPORT_IMPORT_SCENARIOS')}</p>
            <div className="handleScenarioInfo">
              <p className="infoText">{t('EXPORT_IMPORT_SCENARIOS_DESC')}</p>
            </div>
            <div className="duplicateScenarios">
              <div className="text">
                <p>{t('DUPLICATE_SCENARIOS')}</p>
              </div>
              <Button className="duplicateBtn" type="primary" onClick={handleExport}>
                {t('EXPORT')}
              </Button>
              <Button type="lineBlue">{t('IMPORT')}</Button>
            </div>
          </Space>
        </div>
      </Card>
      <Card className="settingCardWrap" radius="normal">
        <Row className="handleScenariosWrap">
          <Space direction="vertical" gap={10}>
            <Col className="deleteBot">
              <p className="settingCardTitle deleteBotTitle">{t('DELETE_BOT_TITLE')}</p>
              <Button type="primary">{t('DELETE')}</Button>
            </Col>
            <Col>
              <p className="deleteBotDesc">{t('DELETE_BOT_DESC')}</p>
            </Col>
          </Space>
        </Row>
      </Card>
    </div>
  );
};
