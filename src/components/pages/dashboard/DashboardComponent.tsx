import { Input } from '@components/data-entry/Input';
import { Title } from '@components/general/Title';

import { useBotClient } from '../../../hooks/client/botClient';
import usePage from '../../../hooks/usePage';
import { useRootState } from '../../../hooks/useRootState';
import { BotCard } from './BotCard';

export const DashboardComponent = () => {
  const { t } = usePage();
  const brandName = useRootState((state) => state.brandInfoReducer.brandName);

  const { getBotListQuery } = useBotClient();
  const { data } = getBotListQuery;

  return (
    <>
      <Title>{brandName}</Title>
      <div style={{ display: 'flex' }}>
        <div>{t('CHATBOT_COUNT', { count: data?.length })}</div>
        <div style={{ flex: 'auto' }}></div>
        <div>
          <Input placeholder={t('SEARCH_PLACEHOLDER')} />
        </div>
      </div>
      <div style={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
        <BotCard id="0" name="새 봇 만들기" />
        {data?.map((bot) => {
          return <BotCard key={bot.id} name={bot.name} updateDate={bot.updateDate} />;
        })}
      </div>
    </>
  );
};
