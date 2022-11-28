import { Button, Card, Col, Divider, Input, Row, Skeleton, Space } from '@components';
import { useBotClient, useModalOpen, usePage, useSystemModal } from '@hooks';
import { IBotModel } from '@models';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { BotCard } from './BotCard';
import { NewBotCard } from './NewBotCard';
import { NewBotPopup } from './NewBotPopup';

export const DashboardComponent = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const { isOpen, handleIsOpen } = useModalOpen();
  const { t } = usePage();
  const { confirm } = useSystemModal();

  const { data, isFetching, botSaveMutate } = useBotClient();

  const handleSave = async (model: IBotModel) => {
    const result = await botSaveMutate.mutateAsync(model);
    if (result) {
      handleIsOpen(false);
      const message = t('NEW_BOT_OK_MESSAGE');
      toast(message, { position: 'bottom-right' });
    }
  };
  const handleTest = async () => {
    const result = await confirm({
      title: 'This page cannot be found.',
      description: 'This page is no longer available.',
    });

    if (result) {
      console.log('confirm');
    } else {
      console.log('cancel');
    }
  };
  return (
    <div className="p-20">
      <Row align="flex-end" justify="space-between">
        <Col>
          {t('CHATBOT_COUNT', { count: data?.length })}
          <Button onClick={handleTest}>테스트</Button>
        </Col>
        <Col className="w-300">
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
    </div>
  );
};
