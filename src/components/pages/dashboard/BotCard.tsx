import { Card } from '@components/data-display/Card';
import { Title } from '@components/general/Title';
import { Col, Row } from '@components/index';
import { FC } from 'react';
import { IBotModel } from 'src/models/interfaces/IBotModel';

import icHome from '../../../assets/ic_home.png';
import usePage from '../../../hooks/usePage';

export const BotCard: FC<{ model: IBotModel }> = ({ model }) => {
  const { navigate, t, tc } = usePage();
  return (
    <Card hoverable onClick={() => navigate('/scenario')}>
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
        <Col flex="auto">
          <Row align="center" gap={5} style={{ paddingBottom: '20px' }}>
            <Col>
              <Title level={3}>{model.botName}</Title>
            </Col>
            <Col>
              <span style={{ color: '#A1A1A1' }}>
                | 운영채널: {model.prodChannel} | 테스트채널: {model.testChannel}
              </span>
            </Col>
          </Row>
          <span style={{ fontSize: '10px', color: '#A1A1A1' }}>{`${tc('intlDateTime', {
            val: model.updateDate ? new Date(model.updateDate) : '',
          })}`}</span>
        </Col>
      </Row>
    </Card>
  );
};
