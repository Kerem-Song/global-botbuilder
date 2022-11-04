import { Card } from '@components/data-display/Card';
import { Input } from '@components/data-entry/Input';
import { Title } from '@components/general/Title';
import usePage from '../../../hooks/usePage';
import { BotCard } from './BotCard';

export const DashboardComponent = () => {
  return (
    <>
      <Title>브랜드이름</Title>
      <div style={{ display: 'flex' }}>
        <div>내 챗봇 : 0</div>
        <div style={{ flex: 'auto' }}></div>
        <div>
          <Input placeholder="봇 이름을 검색하세요." />
        </div>
      </div>
      <BotCard />
      <BotCard />
      <BotCard />
      <BotCard />
    </>
  );
};
