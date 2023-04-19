import { icCopy, icLine } from '@assets';
import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
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
  const { confirm } = useSystemModal();
  const { botId } = useParams();
  const { refetchBotInfo, botExportAsync, botUpdateAsync } = useBotClient();
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

  const preventGoBack = async () => {
    const result = await confirm({
      title: t('SAVE'),
      description: (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          <p>{tc('SAVE_CONFIRM_MESSAGE')}</p>
        </div>
      ),
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
                  <Button type="primary" onClick={() => setActivate(true)}>
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
                      <img src={icLine} alt="socialImg" />
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
              <div className="botActivateCardWrap">
                <div className="botActivateCard">
                  <div className="channel">
                    <div className="channelImg">
                      <img src={icLine} alt="socialImg" />
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
