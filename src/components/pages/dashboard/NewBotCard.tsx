import { Card } from '@components/data-display/Card';
import { Title } from '@components/general/Title';
import { Col, Row, Space } from '@components/index';
import { FC } from 'react';

import icHome from '../../../assets/ic_home.png';
import usePage from '../../../hooks/usePage';

export const NewBotCard: FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = usePage();
  return (
    <Card hoverable onClick={onClick}>
      <Row gap={20}>
        <Col>
          <div
            style={{
              boxSizing: 'border-box',
              margin: '10px',
              background: '#DEDEDE',
              height: '80px',
              borderRadius: '40px',
              border: '1px solid #CCCCCC',
              padding: '28px',
              width: '80px',
              textAlign: 'center',
            }}
          >
            <img src={icHome} alt="" />
          </div>
        </Col>
        <Space direction="vertical" gap={20}>
          <Title level={3}>{t('NEW_BOT_TITLE')}</Title>
          <span style={{ fontSize: '10px', color: '#A1A1A1' }}>
            {t('NEW_BOT_DESCRIPTION')}
          </span>
        </Space>
      </Row>
    </Card>
  );
};
