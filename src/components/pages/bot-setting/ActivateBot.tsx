import { Button, Card, Col, Row, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { useEffect, useState } from 'react';

import { ConnectChannel } from './ConnectChannel';

export const ActivateBot = () => {
  const { t, navigate } = usePage();
  const { confirm, error } = useSystemModal();
  const { botActivateAsync } = useBotClient();
  const [activate, setActivate] = useState<boolean>();
  const botSettingInfo = useRootState(
    (state) => state.botSettingInfoReducer.botSettingInfo,
  );

  const handleActivateBot = async () => {
    if (!botSettingInfo) {
      return;
    }

    const { id } = botSettingInfo;

    const botActivate = {
      botId: id,
      isActivate: true,
    };

    const res = await botActivateAsync({ ...botActivate, customErrorCode: [7647, 7631] });

    if (res === 7647) {
      error({
        title: t('FAILED_ACTIVATED_BOT'),
        description: (
          <p style={{ whiteSpace: 'pre-line' }}>{t('BOT_IS_NOT_ACTIVATE_EXCEPTION')}</p>
        ),
      });
    } else if (res === 7631) {
      error({
        title: t('FAILED_ACTIVATED_BOT'),
        description: (
          <p style={{ whiteSpace: 'pre-line' }}>
            {t('ALREADY_EXISTS_ACTIVATED_BOT_EXCEPTION')}
          </p>
        ),
      });
    } else {
      lunaToast.success(t('SUCCESS_ACTIVATED_BOT'));
      return;
    }
  };

  const handleDisableBot = async () => {
    if (!botSettingInfo) {
      return;
    }

    const botInactivate = {
      botId: botSettingInfo.id,
      isActivate: false,
    };

    const res = await confirm({
      title: t('DEACTIVATE_BOT'),
      description: (
        <p style={{ whiteSpace: 'pre-wrap' }}>{t('DEACTIVATE_BOT_MESSAGE')}</p>
      ),
    });

    if (res) {
      await botActivateAsync(botInactivate);
      lunaToast.success(t('DEACTIVATE_BOT_SUCCESS_MESSAGE'));
    }
  };

  useEffect(() => {
    if (botSettingInfo) {
      setActivate(botSettingInfo.activated);
    }
  }, [botSettingInfo]);

  return (
    <Card className="settingCardWrap" radius="normal">
      <div className="activateWrap">
        <Space direction="vertical">
          <Row justify="space-between" align="center">
            <Col>
              <p className="settingCardTitle">{t('ACTIVATED_THE_BOT')}</p>
            </Col>
            <Space gap={8}>
              {activate ? (
                <Button type="lineBlue" onClick={handleDisableBot}>
                  {t('DEACTIVATE')}
                </Button>
              ) : (
                <Button
                  type="primary"
                  disabled={
                    botSettingInfo?.alreadyActivatedBotName === null ? false : true
                  }
                  onClick={handleActivateBot}
                >
                  {t('ACTIVATE')}
                </Button>
              )}
              <Button onClick={() => navigate('/dashboard')}>{t('BOT_LIST')}</Button>
            </Space>
          </Row>
          <ConnectChannel />
        </Space>
      </div>
    </Card>
  );
};
