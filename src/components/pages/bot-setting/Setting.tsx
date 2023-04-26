import { Col, Row } from '@components';
import { useBotClient, usePage } from '@hooks';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import { ActivateBot } from './ActivateBot';
import { DefaultSettingBot } from './DefaultSettingBot';
import { DeleteBot } from './DeleteBot';
import { HandleBotScenario } from './HandleBotScenario';

export const Setting = () => {
  const { t } = usePage();
  const { botId } = useParams();
  const { refetchBotInfo } = useBotClient();

  useEffect(() => {
    if (botId) {
      refetchBotInfo(botId);
    }
  }, [botId]);

  return (
    <div className="settingWrap">
      <Row className="m-b-20" justify="space-between" align="center">
        <Col>
          <div className="title">{t('TITLE')}</div>
        </Col>
      </Row>
      <DefaultSettingBot />
      <ActivateBot />
      <HandleBotScenario />
      <DeleteBot />
    </div>
  );
};
