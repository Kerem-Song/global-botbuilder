import { Skeleton } from '@components/feedback/Skeleton';
import { Button, Card, Col, Divider, Input, Row, Space } from '@components/index';
import { IBotModel } from '@models/interfaces';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { useBotClient } from '../../../hooks/client/botClient';
import { useModalOpen } from '../../../hooks/useModalOpen';
import usePage from '../../../hooks/usePage';
import { useSystemModal } from '../../../hooks/useSystemModal';
import { BotCard } from './BotCard';
import { NewBotCard } from './NewBotCard';
import { NewBotPopup } from './NewBotPopup';

export const DashboardComponent = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const { isOpen, handleIsOpen } = useModalOpen();
  const { t } = usePage();
  const { info } = useSystemModal();

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
  const handleTest = () => {
    info({
      title: 'This page cannot be found.',
      description: 'This page is no longer available.',
    });
  };
  return (
    <>
      <Row align="flex-end" justify="space-between">
        <Col>
          {t('CHATBOT_COUNT', { count: data?.length })}
          <Button onClick={handleTest}>테스트</Button>
        </Col>
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
          <Card>
            <Skeleton />
          </Card>
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
