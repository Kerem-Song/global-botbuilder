import { icCopy } from '@assets';
import { Button, Card, Col, Input, Row, Space } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { IBotSetting } from '@models/interfaces/IBotSetting';
import { BOTNAME_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import * as yup from 'yup';

export const DefaultSettingBot = () => {
  const { t, tc } = usePage();
  const { confirm } = useSystemModal();
  const { botUpdateAsync } = useBotClient();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
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
    if (botInfo) {
      reset({
        botId: botInfo.id,
        botName: botInfo.botName,
      });
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
  );
};
