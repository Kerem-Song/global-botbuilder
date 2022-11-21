import { Card } from '@components/data-display/Card';
import { Title } from '@components/general/Title';
import { FC } from 'react';
import { IBotModel } from 'src/models/interfaces/IBotModel';
import { IHasChildren } from 'src/models/interfaces/IHasChildren';

import icHome from '../../../assets/ic_home.png';
import usePage from '../../../hooks/usePage';

export const BotCard: FC<{ model: IBotModel }> = ({ model }) => {
  const { navigate, t, tc } = usePage();
  return (
    <Card hoverable onClick={() => navigate('/scenario')}>
      <div style={{ display: 'flex' }}>
        <div style={{ paddingRight: '20px' }}>
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
        </div>
        <div style={{ flex: 'auto' }}>
          <div>
            <Title level={3}>{model.botName}</Title>
            <span>
              | 운영채널: {model.prodChannel} | 테스트채널: {model.testChannel}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '10px' }}>{`${tc('intlDateTime', {
              val: model.updateDate ? new Date(model.updateDate) : '',
            })}`}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
