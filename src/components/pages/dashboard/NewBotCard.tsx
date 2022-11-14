import { Card } from '@components/data-display/Card';
import { Title } from '@components/general/Title';
import { FC } from 'react';

import icHome from '../../../assets/ic_home.png';
import usePage from '../../../hooks/usePage';

export const NewBotCard: FC = () => {
  const { navigate, t } = usePage();
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
            <Title level={3}>{t('NEW_BOT_TITLE')}</Title>
          </div>
          <div>
            <span style={{ fontSize: '10px' }}>{t('NEW_BOT_DESCRIPTION')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
