import { Card, Col, Divider, Input, Row, Space, Title } from '@components/index';
import { IBotModel } from '@models/interfaces';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import { useBotClient } from '../../../hooks/client/botClient';
import { useModalOpen } from '../../../hooks/useModalOpen';
import usePage from '../../../hooks/usePage';
import { useRootState } from '../../../hooks/useRootState';
import { BotCard } from './BotCard';
import { BotSkeleton } from './BotSkeleton';
import { NewBotCard } from './NewBotCard';
import { NewBotPopup } from './NewBotPopup';

export const DashboardComponent = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const { isOpen, handleIsOpen } = useModalOpen();
  const { t } = usePage();
  const brandName = useRootState((state) => state.brandInfoReducer.brandName);

  const { getBotListQuery, botSaveMutate } = useBotClient();
  const { data, isFetching } = getBotListQuery;
  const handleSave = async (model: IBotModel) => {
    const result = await botSaveMutate.mutateAsync(model);
    if (result) {
      handleIsOpen(false);
      const message = t('NEW_BOT_OK_MESSAGE');
      toast(message, { position: 'bottom-right' });
    }
  };

  console.log(data);
  return (
    <>
      <Title>{brandName}</Title>
      <Row align="flex-end" justify="space-between">
        <Col>{t('CHATBOT_COUNT', { count: data?.length })}</Col>
        <Col style={{ width: '300px' }}>
          <Input
            placeholder={t('SEARCH_PLACEHOLDER')}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </Col>
      </Row>
      <Divider />
      <Space direction="vertical">
        <NewBotCard onClick={() => handleIsOpen(true)} />
        {isFetching ? (
          <BotSkeleton />
        ) : (
          data
            ?.filter((x) => x.botName?.includes(searchKeyword))
            .map((bot) => {
              return <BotCard key={bot.id} model={bot} />;
            })
        )}
      </Space>
      <NewBotPopup isOpen={isOpen} handleIsOpen={handleIsOpen} handleSave={handleSave} />
    </>
  );
};
