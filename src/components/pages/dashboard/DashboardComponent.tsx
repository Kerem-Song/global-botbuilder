import { Input } from '@components/data-entry/Input';
import { Title } from '@components/general/Title';
import { Space } from '@components/layout/Space';

import { useBotClient } from '../../../hooks/client/botClient';
import usePage from '../../../hooks/usePage';
import { useRootState } from '../../../hooks/useRootState';
import { BotCard } from './BotCard';
import { NewBotCard } from './NewBotCard';

export const DashboardComponent = () => {
  const { t } = usePage();
  const brandName = useRootState((state) => state.brandInfoReducer.brandName);

  const { getBotListQuery } = useBotClient();
  const { data } = getBotListQuery;

  return (
    <>
      <Title>{brandName}</Title>
      <div style={{ display: 'flex', paddingBottom: '10px' }}>
        <div>{t('CHATBOT_COUNT', { count: data?.length })}</div>
        <div style={{ flex: 'auto' }}></div>
        <div style={{ width: '300px' }}>
          <Input placeholder={t('SEARCH_PLACEHOLDER')} />
        </div>
      </div>
      <Space direction="vertical">
        <NewBotCard />
        {data?.map((bot) => {
          return <BotCard key={bot.id} name={bot.name} updateDate={bot.updateDate} />;
        })}
      </Space>
    </>
  );
};
