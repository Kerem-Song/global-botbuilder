import { Button, Card, Col, Row, Space } from '@components';
import { useBotClient, usePage, useRootState, useSystemModal } from '@hooks';
import { useAuthClient } from '@hooks/client/authClient';
import { useQueryParams } from '@hooks/useQueryParams';
import { useEffect, useState } from 'react';

export const DeleteBot = () => {
  const { t } = usePage();
  const { confirm, info } = useSystemModal();
  const { IssueTokenAsync } = useAuthClient();
  const { botDeleteAsync, botRecoverAsync } = useBotClient();
  const queryParams = useQueryParams();
  const code = queryParams.get('code');
  const brandId = queryParams.get('state');
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const [isDeleteBtnActive, setIsDeleteBtnActive] = useState<boolean>(false);
  const [isRecoverBtnActive, setIsRecoverBtnActive] = useState<boolean>(false);

  const handleDeleteBtnStatus = async () => {
    if (!brandId || !code) {
      return <></>;
    }
    const res = await IssueTokenAsync({ brandId, tokenCode: code });
    if (res.staffType === 0 || res.staffType === 1) {
      setIsDeleteBtnActive(true);
    } else if (res.staffType === 2) {
      setIsDeleteBtnActive(false);
    }
  };

  const handleDeleteBtn = async () => {
    if (!brandId || !code) {
      return <></>;
    }
    const res = await IssueTokenAsync({ brandId, tokenCode: code });
    if (res.staffType === 0 || res.staffType === 1) {
      if (botInfo?.activated === true) {
        const disabledDelete = await confirm({
          title: t('DISABLED_DELETE_BOT'),
          description: <p>{t('DISABLED_DELETE_BOT_MESSAGE')}</p>,
        });
        if (disabledDelete) {
          setIsRecoverBtnActive(false);
        }
      } else if (botInfo?.activated === false) {
        const deleteConfirm = await confirm({
          title: t('DELETE_BOT'),
          description: (
            <p style={{ whiteSpace: 'pre-wrap' }}>{t('DELETE_BOT_CONFIRM_MESSAGE')}</p>
          ),
        });
        if (deleteConfirm) {
          await botDeleteAsync({ botId: botInfo!.id });
          setIsRecoverBtnActive(true);
        }
      }
    } else if (res.staffType === 2) {
      setIsDeleteBtnActive(false);
      await info({
        title: t('NO_DELETE_BOT_ACCESS'),
        description: (
          <p style={{ whiteSpace: 'pre-wrap' }}>{t('NO_DELETE_BOT_ACCESS_MESSAGE')}</p>
        ),
      });
    }
  };

  const handleRecoverBtn = async () => {
    if (!brandId || !code) {
      return <></>;
    }
    const res = await IssueTokenAsync({ brandId, tokenCode: code });
    if (res.staffType === 0 || res.staffType === 1) {
      const recoverConfirm = await confirm({
        title: t('RECOVER_BOT'),
        description: <p>{t('RECOVER_BOT_MESSAGE')}</p>,
      });
      if (recoverConfirm) {
        await botRecoverAsync({ botId: botInfo!.id });
        setIsRecoverBtnActive(false);
      }
    } else if (res.staffType === 2) {
      setIsDeleteBtnActive(false);
      await info({
        title: t('NO_RECOVER_BOT_ACCESS'),
        description: (
          <p style={{ whiteSpace: 'pre-wrap' }}>{t('NO_RECOVER_BOT_ACCESS_MESSAGE')}</p>
        ),
      });
    }
  };

  useEffect(() => {
    handleDeleteBtnStatus();
  }, [brandId, code]);

  return (
    <Card className="settingCardWrap" radius="normal">
      <Row className="handleScenariosWrap">
        <Space direction="vertical" gap={10}>
          <Col className="deleteBot">
            <p className="settingCardTitle deleteBotTitle">{t('DELETE_BOT_TITLE')}</p>
            {isRecoverBtnActive ? (
              <Button type="lineBlue" onClick={handleRecoverBtn}>
                {t('RECOVER_BOT')}
              </Button>
            ) : (
              <Button
                className={isDeleteBtnActive ? 'luna-btn-primary' : 'luna-btn-disabled'}
                onClick={handleDeleteBtn}
              >
                {t('DELETE_BOT')}
              </Button>
            )}
          </Col>
          <Col>
            <p className="deleteBotDesc">{t('DELETE_BOT_DESC')}</p>
          </Col>
        </Space>
      </Row>
    </Card>
  );
};
