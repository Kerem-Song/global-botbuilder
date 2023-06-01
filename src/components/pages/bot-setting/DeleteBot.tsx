import { Button, Card, Col, Row, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { util } from '@modules/util';
import { useEffect, useState } from 'react';

export const DeleteBot = () => {
  const { t } = usePage();
  const { confirm } = useSystemModal();
  const { botDeleteAsync, botRecoverAsync } = useBotClient();
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const staffType = useRootState((state) => state.userInfoReducer.staffType);
  const isManager = staffType === 2;
  const removeCancelExpireUtc = botInfo && botInfo.removeCancelExpireUtc;
  const [activeDeleteBtn, setActiveDeleteBtn] = useState<boolean>(false);
  const [activeRecoverBtn, setActiveRecoverBtn] = useState<boolean>(false);

  const checkActivatedBot = async (isManager: number) => {
    if (botInfo && !isManager) {
      const title = botInfo.activated ? t('DISABLED_DELETE_BOT') : t('DELETE_BOT');
      const message = botInfo.activated
        ? t('DISABLED_DELETE_BOT_MESSAGE')
        : t('DELETE_BOT_CONFIRM_MESSAGE');
      const result = await confirm({
        title,
        description: <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>,
      });
      if (result && !botInfo.activated) {
        await botDeleteAsync({ botId: botInfo.id }).then((res) => {
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
        await botRecoverAsync({ botId: botInfo!.id });
        setActiveRecoverBtn(false);
      }
    }
  };

  useEffect(() => {
    if (botInfo && !isManager) {
      if (removeCancelExpireUtc === null) {
        setActiveDeleteBtn(true);
      } else if (removeCancelExpireUtc !== null) {
        setActiveRecoverBtn(true);
      }
    }
  }, [botInfo && botInfo.id, removeCancelExpireUtc, isManager]);

  return (
    <Card className="settingCardWrap" radius="normal">
      {botInfo && (
        <Row className="handleScenariosWrap">
          <Space direction="vertical" gap={10}>
            <Col className="deleteBot">
              <p className="settingCardTitle deleteBotTitle">{t('DELETE_BOT_TITLE')}</p>
              {activeRecoverBtn ? (
                <Button
                  type="lineBlue"
                  disabled={activeRecoverBtn ? false : true}
                  onClick={handleRecoverBtn}
                >
                  {t('RECOVER_BOT')}
                </Button>
              ) : (
                <Button
                  type="error"
                  disabled={activeDeleteBtn ? false : true}
                  onClick={handleDeleteBtn}
                >
                  {t('DELETE_BOT')}
                </Button>
              )}
              {removeCancelExpireUtc ? (
                <p className="cancelExpireUtc">
                  {util.formatDateTime(new Date(removeCancelExpireUtc))}
                  {t('CANCEL_EXPIRE_MESSAGE')}
                </p>
              ) : null}
            </Col>
            <Col>
              <p className="deleteBotDesc">{t('DELETE_BOT_DESC')}</p>
            </Col>
          </Space>
        </Row>
      )}
    </Card>
  );
};
