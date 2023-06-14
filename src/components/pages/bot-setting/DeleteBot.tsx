import { Button, Card, Col, Row, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { util } from '@modules/util';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export const DeleteBot = () => {
  const { t } = usePage();
  const { botId } = useParams();
  const { confirm } = useSystemModal();
  const { botDeleteAsync, botRecoverAsync, getBotSettingInfoQuery } = useBotClient();
  const { data: botSettingInfo } = getBotSettingInfoQuery(botId!);
  const staffType = useRootState((state) => state.userInfoReducer.staffType);
  const isManager = staffType === 2;
  const removeCancelExpireUtc = botSettingInfo && botSettingInfo.removeCancelExpireUtc;
  const [activeDeleteBtn, setActiveDeleteBtn] = useState<boolean>(false);
  const [activeRecoverBtn, setActiveRecoverBtn] = useState<boolean>(false);

  const checkActivatedBot = async (isManager: number) => {
    if (botSettingInfo && !isManager) {
      const title = botSettingInfo.activated ? t('DISABLED_DELETE_BOT') : t('DELETE_BOT');
      const message = botSettingInfo.activated
        ? t('DISABLED_DELETE_BOT_MESSAGE')
        : t('DELETE_BOT_CONFIRM_MESSAGE');
      const result = await confirm({
        title,
        description: <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>,
      });
      if (result && !botSettingInfo.activated) {
        await botDeleteAsync({ botId: botSettingInfo.id }).then((res) => {
          console.log(res?.data);
          setActiveRecoverBtn(true);
        });
      }
    }
  };

  const handleDeleteBtn = async () => {
    if (!isManager) {
      await checkActivatedBot(staffType!);
    } else {
      setActiveDeleteBtn(false);
    }
  };

  const handleRecoverBtn = async () => {
    if (!isManager) {
      const recoverConfirm = await confirm({
        title: t('RECOVER_BOT'),
        description: <p>{t('RECOVER_BOT_MESSAGE')}</p>,
      });
      if (recoverConfirm) {
        await botRecoverAsync({ botId: botSettingInfo!.id });
        setActiveRecoverBtn(false);
      }
    }
  };

  useEffect(() => {
    if (botSettingInfo && !isManager) {
      if (removeCancelExpireUtc === null) {
        setActiveDeleteBtn(true);
      } else if (removeCancelExpireUtc !== null) {
        setActiveRecoverBtn(true);
      }
    }
  }, [botSettingInfo && botSettingInfo.id, removeCancelExpireUtc, isManager]);

  return (
    <Card className="settingCardWrap" radius="normal">
      {botSettingInfo && (
        <Row className="handleScenariosWrap">
          <Space direction="vertical" gap={10}>
            <Col className="deleteBot">
              <p className="settingCardTitle">{t('DELETE_BOT_TITLE')}</p>
              {removeCancelExpireUtc ? (
                <p className="cancelExpireUtc">
                  {util.toLocaleDateTimeString(new Date(removeCancelExpireUtc))}
                  {t('CANCEL_EXPIRE_MESSAGE')}
                </p>
              ) : null}
            </Col>
            <Col>
              <p className="deleteBotDesc">{t('DELETE_BOT_DESC')}</p>
            </Col>
          </Space>
          <Col>
            {activeRecoverBtn ? (
              <Button
                type="default"
                disabled={activeRecoverBtn ? false : true}
                onClick={handleRecoverBtn}
              >
                {t('RECOVER_BOT')}
              </Button>
            ) : (
              <Button
                type="secondary"
                disabled={activeDeleteBtn ? false : true}
                onClick={handleDeleteBtn}
              >
                {t('DELETE_BOT')}
              </Button>
            )}
          </Col>
        </Row>
      )}
    </Card>
  );
};
