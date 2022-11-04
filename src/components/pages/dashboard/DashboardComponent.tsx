import { Input } from '@components/data-entry/Input';
import { Title } from '@components/general/Title';

import usePage from '../../../hooks/usePage';
import { useRootState } from '../../../hooks/useRootState';
import { BotCard } from './BotCard';

export const DashboardComponent = () => {
  const { t } = usePage();
  const brandName = useRootState((state) => state.brandInfoReducer.brandName);

  return (
    <>
      <Title>{brandName}</Title>
      <div style={{ display: 'flex' }}>
        <div>{t('CHATBOT_COUNT', { count: 100 })}</div>
        <div style={{ flex: 'auto' }}></div>
        <div>
          <Input placeholder={t('SEARCH_PLACEHOLDER')} />
        </div>
      </div>
      <div style={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
        <BotCard />
        <BotCard />
        <BotCard />
        <BotCard />
      </div>
    </>
  );
};
