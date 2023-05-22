import { icCopy, icImg } from '@assets';
import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { imageUploadClient, useBotClient, usePage, useRootState } from '@hooks';
import { usePrompt } from '@hooks/usePrompt';
import { IBotSetting } from '@models/interfaces/IBotSetting';
import { BOTNAME_REGEX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import * as yup from 'yup';

export const DefaultSettingBot = () => {
  const { t, tc } = usePage();
  const { imageUploadAsync } = imageUploadClient();
  const { botUpdateNameAsync, botImageUploadAsync } = useBotClient();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const botNameRef = useRef<HTMLInputElement | null>(null);
  const botProfileInputRef = useRef<HTMLInputElement>(null);
  const [isSaveBtnActive, setIsSaveBtnActive] = useState<boolean>(false);

  usePrompt(isSaveBtnActive);

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
    if (botInfo) {
      reset({
        botId: botInfo.id,
        botName: botInfo.botName,
      });
    }
  }, [botInfo]);

  useEffect(() => {
    if (field.value === '' && botNameRef.current) {
      botNameRef.current.focus();
    }
  }, [field.value]);

  const handleBotName = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    setIsSaveBtnActive(true);
  };

  const handleSaveBotName = async () => {
    const saveBotName = {
      botId: getValues('botId'),
      botName: getValues('botName').trim(),
    };

    const res = await botUpdateNameAsync(saveBotName);

    if (res?.data.isSuccess) {
      lunaToast.success(tc('SAVE_MESSAGE'));
      setIsSaveBtnActive(false);
    }
  };

  const handleCopyBotId = async () => {
    await util.copyClipboard(botInfo?.id);
    lunaToast.info(t('COPY_BOT_ID_MESSAGE'));
  };

  const handleUpdateBotIcon = useCallback(() => {
    if (!botProfileInputRef.current) {
      return;
    }
    botProfileInputRef.current.click();
  }, [botProfileInputRef]);

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
              <span>{t('BOT_NAME')}</span>
              <span className="required"> *</span>
            </Col>
            <Col flex="auto">
              <FormItem error={errors.botName}>
                <Input
                  value={field.value || ''}
                  ref={(e) => {
                    field.ref(e);
                    botNameRef.current = e;
                  }}
                  onChange={handleBotName}
                  placeholder={t('BOT_NAME_PLACEHOLDER')}
                  maxLength={20}
                  showCount
                />
              </FormItem>
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
            <Input className="botId" value={botInfo?.id || ''} disabled />
          </Col>
          <Col>
            <Button onClick={handleCopyBotId} icon={icCopy}>
              {t('COPY')}
            </Button>
          </Col>
        </Row>
        <Row gap={10} align="center">
          <Col className="botInfo">
            <span>{t('BOT_PROFILE')}</span>
          </Col>
          <Col flex="auto" className="botInfo botProfileImgwrap">
            <Space>
              <div className="botProfileImg">
                <img src={icImg} alt="icImg" />
              </div>
              <input
                type="file"
                className="fileInput"
                ref={botProfileInputRef}
                accept="image/png, image/jpeg, image/jpg"
              />
              <Space>
                <div className="botProfileUploadBtnWrap">
                  <span className="info">{t('RECOMMEND_BOT_IMG_SIZE')}</span>
                  <Space>
                    <Button type="lineBlue" onClick={handleUpdateBotIcon}>
                      {t('FILE_UPLOAD')}
                    </Button>
                    <Button type="primary">{t('PROFILE_SAVE')}</Button>
                  </Space>
                </div>
              </Space>
            </Space>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};
