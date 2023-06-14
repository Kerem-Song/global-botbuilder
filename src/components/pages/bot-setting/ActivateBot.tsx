import { Button, Card, Col, Row, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { lunaToast } from '@modules/lunaToast';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { ConnectChannel } from './ConnectChannel';

export const ActivateBot = () => {
  const { t, navigate } = usePage();
  const { confirm, info } = useSystemModal();
  const { botActivateAsync, getBotSettingInfoQuery } = useBotClient();
  const { botId } = useParams();
  const { data } = getBotSettingInfoQuery(botId!);
  const [activate, setActivate] = useState<boolean>();

  const handleActivateBot = async () => {
    if (!data) {
      return;
    }

    const { id } = data;

    const botActivate = {
      botId: id,
      isActivate: true,
    };

    const res = await botActivateAsync(botActivate);

    if (res?.data.isSuccess) {
      lunaToast.success(t('SUCCESS_ACTIVATED_BOT'));
      console.log('data', data);
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
    if (!data) {
      return;
    }

    const botInactivate = {
      botId: data.id,
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
    if (data) {
      setActivate(data.activated);
    }
  }, [data]);

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
                  disabled={data?.alreadyActivatedBotName === null ? false : true}
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
