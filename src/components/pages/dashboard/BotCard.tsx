import { imgLinebot } from '@assets';
import { Card, Col, Row, Space } from '@components';
import { usePage } from '@hooks';
import { IBotModel } from '@models';
import { FC } from 'react';

export const BotCard: FC<{ model: IBotModel }> = ({ model }) => {
  const { navigate, t } = usePage();
  return (
    <Card
      radius="large"
      onClick={() => navigate(`/${model.id}/scenario`)}
      className="chatbot-card"
      titleClassName="title"
      title={
        <Row align="center" justify="space-between">
          <Col span={20}>
            <Space direction="vertical" gap={4}>
              <Row align="center">
                <Col>
                  {model.activated && (
                    <div className="active">{t('BOT_STATUS_ACTIVE')}</div>
                  )}
                </Col>
                <Col>
                  <span className="created">
                    {model.lastUpdateUTC
                      ? new Date(model.lastUpdateUTC).toLocaleDateString()
                      : ''}
                  </span>
                </Col>
              </Row>
              <div className="bot-name">{model.botName}</div>
            </Space>
          </Col>
          <Col span={4} style={{ textAlign: 'end' }}>
            <img src={imgLinebot} width={48} height={48} alt="linebot" />
          </Col>
        </Row>
      }
    >
      <Space direction="vertical" className="channelWrapper" gap={4}>
        <span className="channel-title">{t('PROD_CHANNEL')}</span>
        <span className="channel-name">
          {model.channelInfos?.find((x) => x.isLive)?.name || '-'}
        </span>
        <span className="channel-title">{t('TEST_CHANNEL')}</span>
        <span className="channel-name">
          {model.channelInfos?.find((x) => !x.isLive)?.name || '-'}
        </span>
      </Space>
    </Card>
  );
};
