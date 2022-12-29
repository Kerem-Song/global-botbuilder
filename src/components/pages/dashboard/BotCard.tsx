import { imgLinebot } from '@assets';
import { Card, Col, Row, Space } from '@components';
import { usePage } from '@hooks';
import { IBotModel } from '@models';
import { FC } from 'react';

export const BotCard: FC<{ model: IBotModel }> = ({ model }) => {
  const { navigate, t, tc } = usePage();
  return (
    <Card
      radius="large"
      onClick={() => navigate(`/${model.id}/scenario`)}
      className="chatbot-card"
      titleClassName="title"
      title={
        <Row align="center" justify="space-between">
          <Col>
            <Space direction="vertical">
              <span className="created">{`${tc('intlDateTime', {
                val: model.updateDate ? new Date(model.updateDate) : '',
              })}`}</span>
              <span className="bot-name">{model.botName}</span>
            </Space>
          </Col>
          <Col>
            <img src={imgLinebot} width={48} height={48} alt="linebot" />
          </Col>
        </Row>
      }
    >
      <Space direction="vertical">
        <span className="channel-title">{t('PROD_CHANNEL')}</span>
        <span className="channel-name">{model.prodChannel}</span>
        <span className="channel-title">{t('TEST_CHANNEL')}</span>
        <span className="channel-name">{model.testChannel}</span>
      </Space>
    </Card>
  );
};
