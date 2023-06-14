import { Button, Card, Col, Row, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { useEffect, useState } from 'react';

import { ConnectChannel } from './ConnectChannel';

export const ActivateBot = () => {
  const { t, navigate } = usePage();
  const { confirm, info } = useSystemModal();
  const { botActivateAsync } = useBotClient();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const [activate, setActivate] = useState<boolean>();

  const handleActivateBot = async () => {
    if (!botInfo) {
      return;
    }

    const { id } = botInfo;

    const botActivate = {
      botId: id,
      isActivate: true,
    };

    const res = await botActivateAsync(botActivate);

    if (res?.data.isSuccess) {
      lunaToast.success(t('SUCCESS_ACTIVATED_BOT'));
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
    if (!botInfo) {
      return;
    }

    const botInactivate = {
      botId: botInfo.id,
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
    if (botInfo) {
      setActivate(botInfo.activated);
    }
  }, [botInfo]);

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
                <Button type="primary" onClick={handleActivateBot}>
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
