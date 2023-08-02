import { Col, Row } from '@components';
import { useBotClient, usePage } from '@hooks';
import { setBotSettingInfo } from '@store/botSettingInfoSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { ActivateBot } from './ActivateBot';
import { DefaultSettingBot } from './DefaultSettingBot';
import { DeleteBot } from './DeleteBot';
import { HandleBotScenario } from './HandleBotScenario';

export const SettingComponent = () => {
  const { t } = usePage();
  const { botId } = useParams();
  const dispatch = useDispatch();
  const { getBotSettingInfoQuery } = useBotClient();

  if (botId) {
    getBotSettingInfoQuery(botId);
  }

  useEffect(() => {
    return () => {
      dispatch(setBotSettingInfo());
    };
  }, []);

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
