import { Card } from '@components/data-display/Card';
import { Title } from '@components/general/Title';

import icHome from '../../../assets/ic_home.png';
import usePage from '../../../hooks/usePage';

export const BotCard = () => {
  const { navigate } = usePage();
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
            <Title level={3}>새 봇 만들기</Title>
          </div>
          <div>
            <span style={{ fontSize: '10px' }}>클릭해서 새 봇을 만들어 보세요.</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
