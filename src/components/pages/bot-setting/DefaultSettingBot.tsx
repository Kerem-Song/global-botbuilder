import { icCopy } from '@assets';
import { Button, Card, Col, Input, Row, Space } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBotClient, usePage, useRootState } from '@hooks';
import { usePrompt } from '@hooks/usePrompt';
import { IBotSetting } from '@models/interfaces/IBotSetting';
import { BOTNAME_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import * as yup from 'yup';

import { UploadBotProfile } from './UploadBotProfile';

export const DefaultSettingBot = () => {
  const { t, tc } = usePage();
  const { botId } = useParams();
  const { botUpdateNameAsync, getBotSettingInfoQuery } = useBotClient();
  const { data: botSettingInfo } = getBotSettingInfoQuery(botId!);
  const botNameRef = useRef<HTMLInputElement | null>(null);
  const [botNameInputError, setBotNameInputError] = useState<string>('');
  const [isSaveBtnActive, setIsSaveBtnActive] = useState<boolean>(false);
  const [isProfileSaveBtnActive, setIsProfileSaveBtnActive] = useState<boolean>(false);
  const [isSaveBtnsActive, setIsSaveBtnsActive] = useState({
    isSaveBtnActive: false,
    isProfileSaveBtnActive: false,
  });

  usePrompt(isSaveBtnsActive.isSaveBtnActive || isSaveBtnsActive.isProfileSaveBtnActive);

  const botNameSchema = yup.object({
    botName: yup
      .string()
      .trim()
      .required(tc('REQUIRE_MESSAGE'))
      .matches(BOTNAME_REGEX, {
        message: tc('BOTNAME_REGEX_MESSAGE'),
      }),
  });

  const defaultValues = {
    botId: '',
    botName: '',
  };

  const formMethods = useForm<IBotSetting>({
    defaultValues,
    resolver: yupResolver(botNameSchema),
  });

  const {
    reset,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = formMethods;

  const { field } = useController({ name: 'botName', control });

  useEffect(() => {
    if (botSettingInfo) {
      reset({
        botId: botSettingInfo.id,
        botName: botSettingInfo.botName,
      });
    }
  }, [botSettingInfo?.botName]);

  useEffect(() => {
    if (field.value === '' && botNameRef.current) {
      botNameRef.current.focus();
    }
  }, [field.value]);

  const handleBotName = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    setIsSaveBtnActive(true);
    setIsSaveBtnsActive((prev) => ({ ...prev, isSaveBtnActive: true }));
    setBotNameInputError('');
  };

  const handleSaveBotName = async () => {
    const saveBotName = {
      botId: getValues('botId'),
      botName: getValues('botName').trim(),
    };

    const res = await botUpdateNameAsync(saveBotName);

    if (res?.data.isSuccess) {
      lunaToast.success(t('SAVE_BOT_MESSAGE'));
      setIsSaveBtnActive(false);
      setIsSaveBtnsActive((prev) => ({ ...prev, isSaveBtnActive: false }));

      return;
    }

    if (res?.data.exception.errorCode === 7654) {
      setBotNameInputError(t('VALIDATION_BOT_NAME'));
      return;
    }
  };

  const handleCopyBotId = async () => {
    await util.copyClipboard(botSettingInfo?.id);
    lunaToast.info(t('COPY_BOT_ID_MESSAGE'));
  };

  return (
    <Card className="settingCardWrap" radius="normal">
      <Space direction="vertical">
        <p className="settingCardTitle">{t('DEFAULT_SETTING')}</p>
        <form
          role="presentation"
          onSubmit={handleSubmit(handleSaveBotName)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        >
          <Row gap={10} align="center">
            <Col className="botInfo">
              <span className="botName">{t('BOT_NAME')} </span>
              <span className="required"> *</span>
            </Col>
            <Col flex="auto">
              <Input
                size="normal"
                value={field.value || ''}
                ref={(e) => {
                  field.ref(e);
                  botNameRef.current = e;
                }}
                onChange={handleBotName}
                placeholder={t('BOT_NAME_PLACEHOLDER')}
                maxLength={20}
                showCount
                isError={botNameInputError || errors.botName?.message ? true : false}
              />
              <span className="error-message">{botNameInputError}</span>
              <span className="error-message">{errors.botName?.message}</span>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isSaveBtnActive ? false : true}
              >
                {t('SAVE')}
              </Button>
            </Col>
          </Row>
        </form>
        <Row gap={10} align="center">
          <Col className="botInfo">
            <span>{t('BOT_ID')}</span>
          </Col>
          <Col flex="auto">
            <Input className="botId" value={botSettingInfo?.id || ''} disabled />
          </Col>
          <Col>
            <Button onClick={handleCopyBotId} icon={icCopy}>
              {t('COPY')}
            </Button>
          </Col>
        </Row>
        <UploadBotProfile
          isProfileSaveBtnActive={isProfileSaveBtnActive}
          setIsProfileSaveBtnActive={setIsProfileSaveBtnActive}
          setIsSaveBtnsActive={setIsSaveBtnsActive}
        />
      </Space>
    </Card>
  );
};
