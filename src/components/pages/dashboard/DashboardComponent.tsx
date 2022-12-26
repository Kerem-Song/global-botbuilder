import { Card, Col, Input, Row, Skeleton } from '@components';
import { useBotClient, useModalOpen, usePage } from '@hooks';
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

  const { data, isFetching, botSaveMutate } = useBotClient();

  const handleSave = async (model: IBotModel) => {
    const result = await botSaveMutate.mutateAsync(model);
    if (result) {
      handleIsOpen(false);
      const message = t('NEW_BOT_OK_MESSAGE');
      toast(message, { position: 'bottom-right' });
    }
  };

  return (
    <div className="dashboardWrap">
      <Input
        size="large"
        search
        placeholder={t('SEARCH_PLACEHOLDER')}
        value={searchKeyword}
        onSearch={(v) => setSearchKeyword(v || '')}
      />
      <p className="chatbot-wrap">
        <span className="my-chatbot">{t('MY_CHATBOT')}</span>
        &nbsp;
        <span className="chatbot-count">{data?.length || 0}</span>
      </p>
      <Row gap={20}>
        <Col span={8}>
          <NewBotCard onClick={() => handleIsOpen(true)} />
        </Col>

        {isFetching ? (
          <Col span={8}>
            <Card>
              <Skeleton />
            </Card>
          </Col>
        ) : (
          data
            ?.filter((x) => x.botName?.includes(searchKeyword))
            .map((bot) => {
              return (
                <Col key={bot.id} span={8}>
                  <BotCard model={bot} />
                </Col>
              );
            })
        )}
      </Row>
      <NewBotPopup isOpen={isOpen} handleIsOpen={handleIsOpen} handleSave={handleSave} />
    </div>
  );
};
